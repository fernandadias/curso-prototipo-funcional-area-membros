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

// Dados do aluno para o header (calculados no servidor, fonte da verdade).
// Retorna null quando não é aluno (anônimo ou logado sem acesso) — assim o
// header e a sidebar nunca discordam (o header não refaz a checagem no cliente).
export type AlunoInfo = { nome: string; papel: string };
export async function getAlunoInfo(): Promise<AlunoInfo | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) return null;

    const { data: acesso } = await supabase
      .from("course_access")
      .select("status")
      .eq("email", user.email.toLowerCase())
      .eq("status", "active")
      .maybeSingle();
    if (!acesso) return null;

    const { data: perfil } = await supabase
      .from("profiles")
      .select("name, is_instructor")
      .eq("user_id", user.id)
      .maybeSingle();

    const nome = (perfil?.name as string) || user.email.split("@")[0];
    return { nome, papel: perfil?.is_instructor ? "Instrutora" : "Estudante" };
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
