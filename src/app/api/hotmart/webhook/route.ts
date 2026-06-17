import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { sendWelcomeEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

// Eventos que CONCEDEM acesso e que REVOGAM acesso.
const CONCEDE = new Set(["PURCHASE_APPROVED", "PURCHASE_COMPLETE"]);
const REVOGA = new Set([
  "PURCHASE_REFUNDED",
  "PURCHASE_CHARGEBACK",
  "PURCHASE_CANCELED",
  "PURCHASE_EXPIRED",
  "SUBSCRIPTION_CANCELLATION",
]);

export async function POST(request: NextRequest) {
  const token = process.env.HOTMART_WEBHOOK_TOKEN;
  const hottok =
    request.headers.get("x-hotmart-hottok") ||
    request.headers.get("X-HOTMART-HOTTOK");

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    // alguns formatos antigos vêm como form-urlencoded
    try {
      const form = await request.formData();
      body = Object.fromEntries(form.entries());
    } catch {
      body = {};
    }
  }

  // Validação do token (header ou campo no corpo, conforme versão).
  const bodyHottok = (body.hottok as string) || "";
  if (!token || (hottok !== token && bodyHottok !== token)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Extrai evento e e-mail do comprador (formato 2.0 e fallbacks).
  const event = (body.event as string) || (body.status as string) || "";
  const data = (body.data as Record<string, unknown>) || {};
  const buyer = (data.buyer as Record<string, unknown>) || {};
  const email = (
    (buyer.email as string) ||
    (body.email as string) ||
    ""
  )
    .toString()
    .trim()
    .toLowerCase();

  if (!email) {
    return NextResponse.json({ error: "no email" }, { status: 400 });
  }

  // Nome do comprador (para exibir nos comentários). Pode não vir em todos
  // os eventos — só gravamos quando presente, para não apagar o existente.
  const name =
    ((buyer.name as string) || (body.name as string) || "").toString().trim() ||
    null;

  const concede = CONCEDE.has(event);
  const revoga = REVOGA.has(event);
  if (!concede && !revoga) {
    // evento irrelevante — responde 200 para a Hotmart não reenviar
    return NextResponse.json({ ignored: event });
  }

  const supabase = createAdminClient();

  // Estado anterior — para saber se esta é uma concessão NOVA de acesso
  // (e só então mandar boas-vindas, evitando reenvio em recompra/renovação).
  const { data: anterior } = await supabase
    .from("course_access")
    .select("status")
    .eq("email", email)
    .maybeSingle();
  const eraAtivo = anterior?.status === "active";

  const row: Record<string, unknown> = {
    email,
    status: concede ? "active" : "inactive",
    last_event: event,
    updated_at: new Date().toISOString(),
  };
  if (name) row.name = name;

  const { error } = await supabase
    .from("course_access")
    .upsert(row, { onConflict: "email" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Ao conceder acesso, já cria o usuário no Auth com e-mail confirmado.
  // Assim, no primeiro login ele já existe e confirmado → não dispara o
  // e-mail de "Confirm signup"; sai apenas um único e-mail com o código.
  if (concede) {
    const { error: createError } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
    });
    // "already registered" é esperado em recompras/renovações — ignora.
    if (createError && !/already.*registered|already.*exists/i.test(createError.message)) {
      console.error("[hotmart] createUser error:", createError.message);
    }

    // Boas-vindas apenas quando o acesso passa a ativo pela primeira vez.
    if (!eraAtivo) {
      // Gera um código de acesso já neste momento, para embutir no e-mail —
      // assim a pessoa entra com um único e-mail. Se falhar, manda o e-mail
      // sem código (com o passo a passo de login como fallback).
      let code: string | undefined;
      const { data: link, error: linkError } =
        await supabase.auth.admin.generateLink({ type: "magiclink", email });
      if (linkError) {
        console.error("[hotmart] generateLink error:", linkError.message);
      } else {
        code = link?.properties?.email_otp;
      }
      await sendWelcomeEmail(email, code);
    }
  }

  return NextResponse.json({ ok: true, email, status: concede ? "active" : "inactive" });
}
