export function AuthorBlock({
  nome,
  foto,
  papel = "Criadora do curso",
}: {
  nome: string;
  foto: string;
  papel?: string;
}) {
  return (
    <div className="author">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="author-foto" src={foto} alt={nome} />
      <div>
        <strong className="author-nome">{nome}</strong>
        <span className="author-papel">{papel}</span>
      </div>
    </div>
  );
}
