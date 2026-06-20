import Link from "next/link";

// Empty state de aula "chegando" (em produção). Mostra a previsão, quando há.
export function ComingSoonCard({ previsao }: { previsao?: string }) {
  return (
    <section className="coming-card">
      <span className="aulas-mono">Aula chegando</span>
      <h2>Esta aula está sendo produzida</h2>
      <p>
        Estamos finalizando o conteúdo desta aula
        {previsao ? (
          <>
            {" "}
            — previsão de lançamento: <strong>{previsao}</strong>
          </>
        ) : (
          ""
        )}
        . Enquanto isso, siga pelas aulas já disponíveis.
      </p>
      <Link href="/aulas" className="btn btn-ghost">
        Ver aulas disponíveis
      </Link>
    </section>
  );
}
