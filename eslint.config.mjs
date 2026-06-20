import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // LP estática (JS vanilla, fora do app Next).
    "lp/**",
  ]),
  {
    rules: {
      // Lemos localStorage / buscamos dados em efeitos de montagem
      // (hidratação client-only) de forma intencional. Mantemos como aviso
      // em vez de erro para não travar o CI nesses padrões deliberados.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
