// Link de checkout da Hotmart (mesmo usado na LP).
export const CHECKOUT_URL = "https://pay.hotmart.com/G106003864J?off=u44pgon3";

// Flag de lançamento: a área de comunidade (Início + Encontros) usa dados
// mock até o backend (#9) ficar pronto. Enquanto false, escondemos do menu,
// o login cai em /aulas e as rotas /inicio e /encontros redirecionam.
// Vire para true quando #9/#27 estiverem prontas.
export const COMUNIDADE_ATIVA = false;

// Artigos de ajuda da Hotmart usados nos CTAs do login.
// "Te ajudo": encontrar a compra / e-mail usado.
export const HELP_PURCHASES_URL =
  "https://help.hotmart.com/pt-br/article/115000753807/meus-produtos-todas-as-suas-compras-realizadas-atraves-da-hotmart-em-um-unico-lugar-";
// "Usar outro e-mail": alterar o e-mail de acesso da compra.
export const HELP_CHANGE_EMAIL_URL =
  "https://help.hotmart.com/pt-br/article/9370387188877/fiz-uma-compra-e-preciso-alterar-meu-e-mail-de-acesso";
