export const metadata = { title: "Início" };

// Stub — a home do aluno (saudação, próximo encontro, retomar, avisos,
// calendário) é construída na issue #7.
export default function InicioPage() {
  return (
    <div className="portal-container">
      <h1 style={{ fontSize: 30, fontWeight: 900, margin: "0 0 10px" }}>
        Início
      </h1>
      <p style={{ color: "var(--text-mute)" }}>
        A home do aluno está em construção.
      </p>
    </div>
  );
}
