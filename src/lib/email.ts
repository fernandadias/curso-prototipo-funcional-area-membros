// Envio de e-mails transacionais via Brevo (mesmo provedor do SMTP do
// Supabase). Usa o remetente verificado curso@prototipofuncional.com.br.
// Requer a variável de ambiente BREVO_API_KEY (Brevo → SMTP & API → API Keys).
// Se a chave não estiver definida, apenas registra um aviso e não quebra o
// fluxo que chamou (ex.: o webhook da Hotmart).

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";
const SENDER = {
  name: "Nanda Dias | Protótipo Funcional",
  email: "curso@prototipofuncional.com.br",
};
const LOGIN_URL = "https://www.prototipofuncional.com.br/entrar";

async function sendBrevo(params: {
  email: string;
  subject: string;
  htmlContent: string;
}): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn("[email] BREVO_API_KEY ausente — e-mail não enviado.");
    return;
  }
  try {
    const res = await fetch(BREVO_ENDPOINT, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: SENDER,
        to: [{ email: params.email }],
        subject: params.subject,
        htmlContent: params.htmlContent,
      }),
    });
    if (!res.ok) {
      const detail = await res.text();
      console.error("[email] Brevo falhou:", res.status, detail);
    }
  } catch (err) {
    console.error("[email] erro ao enviar via Brevo:", err);
  }
}

// E-mail de boas-vindas — disparado quando a compra é confirmada na Hotmart.
// Se um `code` for fornecido (gerado no webhook), o e-mail já traz o código de
// acesso e um botão que leva direto à tela de colar, com o e-mail preenchido —
// assim a pessoa entra com um único e-mail. Sem código, cai no passo a passo.
export async function sendWelcomeEmail(
  email: string,
  code?: string,
): Promise<void> {
  // Leva direto ao passo de colar o código, com o e-mail já preenchido e sem
  // reenviar um novo código (que invalidaria o que está neste e-mail).
  const entrarUrl = `${LOGIN_URL}?email=${encodeURIComponent(email)}&codigo=1`;

  const blocoCodigo = code
    ? `
  <p>Pra entrar agora é rapidinho — use o código abaixo:</p>
  <p style="font-size: 32px; font-weight: bold; letter-spacing: 6px; text-align: center; background: #f4f4f4; padding: 18px; border-radius: 10px; margin: 24px 0;">${code}</p>
  <p style="text-align: center; margin: 28px 0;">
    <a href="${entrarUrl}" style="display: inline-block; background: #d4f542; color: #1c1c1c; font-weight: bold; padding: 14px 28px; border-radius: 999px; text-decoration: none;">Entrar com esse código →</a>
  </p>
  <p style="color: #555; font-size: 14px;">O botão abre a tela de login já com seu e-mail preenchido — é só colar o código. Ele vale por 24 horas; se expirar, peça um novo ali mesmo.</p>`
    : `
  <p style="margin: 24px 0 8px;"><strong>Como entrar:</strong></p>
  <ol style="padding-left: 20px; margin: 0 0 24px;">
    <li>Acesse <a href="${LOGIN_URL}" style="color: #6b8e00; font-weight: bold;">a área do aluno</a>.</li>
    <li>Entre com <strong>este mesmo e-mail</strong> (o da sua compra) — é por ele que o curso te reconhece.</li>
    <li>A gente te envia um <strong>código de acesso</strong> na hora. Digite e comece pelo Módulo 1.</li>
  </ol>
  <p style="text-align: center; margin: 28px 0;">
    <a href="${LOGIN_URL}" style="display: inline-block; background: #d4f542; color: #1c1c1c; font-weight: bold; padding: 14px 28px; border-radius: 999px; text-decoration: none;">Entrar na plataforma →</a>
  </p>`;

  const html = `
<div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a; line-height: 1.6;">
  <p style="font-size: 18px; margin-bottom: 4px;">Hey designer 🍄</p>
  <p>É oficial: sua compra do <strong>Protótipo Funcional</strong> foi confirmada e seu acesso já está liberado. Bora sair do mockup e abrir o editor!</p>
  ${blocoCodigo}
  <p>Qualquer coisa, é só responder este e-mail. Te espero lá dentro.</p>
  <p style="margin-top: 24px;">Bora construir experiências reais.<br><strong>Nanda</strong> 💚</p>
</div>`.trim();

  await sendBrevo({
    email,
    subject: "Seu acesso ao Protótipo Funcional está liberado 💚",
    htmlContent: html,
  });
}
