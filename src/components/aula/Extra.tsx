export function Extra({
  slug,
  titulo,
  descricao,
}: {
  slug: string;
  titulo: string;
  descricao: string;
}) {
  return (
    <a
      className="extra-card"
      href={`/extras/${slug}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="extra-card-tag">⤴ Extra</span>
      <strong className="extra-card-titulo">{titulo}</strong>
      <p className="extra-card-desc">{descricao}</p>
    </a>
  );
}
