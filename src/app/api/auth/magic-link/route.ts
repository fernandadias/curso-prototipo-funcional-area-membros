import { NextResponse, type NextRequest } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// Envia o magic link APENAS para e-mails que já compraram (course_access
// ativo). Por segurança, sempre responde { ok: true } — não revela se o
// e-mail é (ou não) de um aluno (evita enumeração de compradores).
export async function POST(request: NextRequest) {
  let email = "";
  try {
    const body = await request.json();
    email = (body.email || "").toString().trim().toLowerCase();
  } catch {
    /* ignore */
  }

  if (!email) {
    return NextResponse.json({ error: "email obrigatório" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: acesso } = await admin
    .from("course_access")
    .select("status")
    .eq("email", email)
    .eq("status", "active")
    .maybeSingle();

  // Só dispara o e-mail se for comprador ativo.
  if (acesso) {
    const { origin } = new URL(request.url);
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=/aulas`,
        shouldCreateUser: true,
      },
    });
    if (error) {
      // Log no servidor para diagnóstico (rate limit, SMTP, etc.).
      console.error("[magic-link] signInWithOtp error:", error.status, error.message);
    }
  }

  return NextResponse.json({ ok: true });
}
