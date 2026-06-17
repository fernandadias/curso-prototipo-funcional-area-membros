"use client";

import { useEffect } from "react";

// Captura de leads da landing: intercepta qualquer CTA de compra
// ([data-cta="hotmart"]), abre o modal #leadModal (markup em lp-body.html),
// envia o lead para o Brevo e redireciona para o checkout da Hotmart.
//
// Vive em React (e não no landing.js) para ser resiliente: re-executa a cada
// montagem da landing — inclusive ao voltar por navegação interna — e usa
// delegação de clique, então não depende do timing de carregamento do script.

const HOTMART_URL = "https://pay.hotmart.com/G106003864J?off=u44pgon3";
const BREVO_FORM_URL =
  "https://4c5e69f2.sibforms.com/serve/MUIFAHixP8yVTeIvCXAUj_s9mvhkKhMgSa_bNLNa2xVCAkdEqNOf2Lpah44bhbvg9eDWFwCL2f7eWOgwUkZRcUPBn80qPGGns1xtXKn96GipeJoCPX2w3BC6RLaMmAGH6xf9iY-nu883XMV1dbL0BGzUg4koM_o6I_w309ij7jGnQFkqkhwXbnpFyfJML6a9YuIaqLqOGnf5U3iu";

export function LeadCapture() {
  useEffect(() => {
    const modal = document.querySelector<HTMLElement>("#leadModal");
    const form = document.querySelector<HTMLFormElement>("#leadForm");
    if (!modal || !form) return;

    const closeBtn = modal.querySelector<HTMLElement>(".lead-modal-close");
    const errEl = form.querySelector<HTMLElement>(".lead-form-err");
    const submitBtn = form.querySelector<HTMLButtonElement>(".lead-submit");
    const emailInput = form.querySelector<HTMLInputElement>('input[name="EMAIL"]');
    const nameInput = form.querySelector<HTMLInputElement>('input[name="NOME"]');
    let lastTrigger: HTMLElement | null = null;

    const showError = (msg: string) => {
      if (errEl) {
        errEl.textContent = msg;
        errEl.hidden = false;
      }
    };
    const clearError = () => {
      if (errEl) {
        errEl.hidden = true;
        errEl.textContent = "";
      }
    };

    const openLead = () => {
      lastTrigger = document.activeElement as HTMLElement | null;
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      setTimeout(() => (nameInput || emailInput)?.focus(), 260);
    };
    const closeLead = () => {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      clearError();
      lastTrigger?.focus?.();
    };

    // Delegação no document — pega o clique em qualquer CTA de compra e o
    // clique no backdrop do modal (para fechar).
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (target?.closest?.('[data-cta="hotmart"]')) {
        e.preventDefault();
        openLead();
        return;
      }
      if (e.target === modal) closeLead();
    };

    const onKeydown = (e: KeyboardEvent) => {
      if (!modal.classList.contains("open")) return;
      if (e.key === "Escape") {
        closeLead();
        return;
      }
      // Foco circular dentro do modal.
      if (e.key === "Tab") {
        const focusables = modal.querySelectorAll<HTMLElement>(
          "button,input,select,textarea,a[href]",
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

    const onSubmit = async (e: Event) => {
      e.preventDefault();
      clearError();
      const data = new FormData(form);
      const email = (data.get("EMAIL") || "").toString().trim();
      const name = (data.get("NOME") || "").toString().trim();
      const phone = (data.get("TELEFONE") || "").toString().trim();
      if (!email) {
        showError("Email é obrigatório");
        emailInput?.focus();
        return;
      }
      if (!isValidEmail(email)) {
        showError("Digite um email válido");
        emailInput?.focus();
        return;
      }

      const originalLabel = submitBtn?.textContent ?? "";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Enviando...";
      }

      // Envia ao Brevo, mas não bloqueia o checkout se falhar.
      try {
        await fetch(BREVO_FORM_URL, { method: "POST", body: data, mode: "no-cors" });
      } catch {
        /* segue para o checkout mesmo assim */
      }

      const params = new URLSearchParams();
      params.set("email", email);
      if (name) params.set("name", name);
      if (phone) params.set("phonenumber", phone);
      const sep = HOTMART_URL.includes("?") ? "&" : "?";
      window.location.href = HOTMART_URL + sep + params.toString();

      // Fallback caso o redirect demore.
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        }
      }, 4000);
    };

    document.addEventListener("click", onClick);
    closeBtn?.addEventListener("click", closeLead);
    document.addEventListener("keydown", onKeydown);
    form.addEventListener("submit", onSubmit);

    return () => {
      document.removeEventListener("click", onClick);
      closeBtn?.removeEventListener("click", closeLead);
      document.removeEventListener("keydown", onKeydown);
      form.removeEventListener("submit", onSubmit);
    };
  }, []);

  return null;
}
