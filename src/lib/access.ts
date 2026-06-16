import { createClient } from "./supabase/server";

// Usuário logado (ou null). Usa getUser() — valida o token no servidor.
export async function getCurrentUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

// O aluno logado tem acesso ao conteúdo pago?
// Checa a tabela course_access pelo e-mail (preenchida pelo webhook da
// Hotmart). RLS permite ao usuário ler a própria linha.
export async function userHasAccess(): Promise<boolean> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) return false;

    const { data } = await supabase
      .from("course_access")
      .select("status")
      .eq("email", user.email.toLowerCase())
      .eq("status", "active")
      .maybeSingle();

    return Boolean(data);
  } catch {
    return false;
  }
}
