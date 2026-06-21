// Fallback de rota da aula. Sua presença habilita o *prefetch parcial* da rota
// dinâmica (o Next pré-carrega este esqueleto) e dá feedback instantâneo no
// clique, antes do servidor responder. O cabeçalho real chega logo em seguida.
export default function LoadingAula() {
  return (
    <div className="aulas-container" aria-busy="true">
      <div className="aula-sk-head" aria-hidden="true">
        <span className="sk-line sk-mono" style={{ width: "180px" }} />
        <span className="sk-title" style={{ width: "70%" }} />
        <span className="sk-line" style={{ width: "55%" }} />
      </div>
      <div className="aula-sk">
        <span className="sk-line" style={{ width: "92%" }} />
        <span className="sk-line" style={{ width: "98%" }} />
        <span className="sk-line" style={{ width: "85%" }} />
        <span className="sk-line sk-gap" style={{ width: "70%" }} />
        <span className="sk-line" style={{ width: "95%" }} />
        <span className="sk-line" style={{ width: "60%" }} />
      </div>
    </div>
  );
}
