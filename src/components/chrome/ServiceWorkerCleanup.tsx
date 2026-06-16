"use client";

import { useEffect } from "react";

// Este projeto não usa service worker. Porém localhost (e o domínio de
// produção, caso já tenha hospedado outro app antes) pode ter um SW antigo
// registrado por um projeto anterior, que intercepta requisições e quebra o
// app com erros tipo "Failed to convert value to 'Response'". Aqui
// desregistramos qualquer SW e limpamos caches para auto-curar.
export function ServiceWorkerCleanup() {
  useEffect(() => {
    if (typeof navigator === "undefined") return;
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .getRegistrations()
        .then((regs) => regs.forEach((r) => r.unregister()))
        .catch(() => {});
    }
    if (typeof caches !== "undefined") {
      caches
        .keys()
        .then((keys) => keys.forEach((k) => caches.delete(k)))
        .catch(() => {});
    }
  }, []);

  return null;
}
