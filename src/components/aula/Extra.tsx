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
      <div className="extra-card-hd">
        <span className="extra-card-tag">Extra</span>
        <span className="extra-card-cta">Abrir ↗</span>
      </div>
      <div className="extra-card-bd" data-cursor-dark>
        <span className="extra-card-titulo">{titulo}</span>
        <p className="extra-card-desc">{descricao}</p>
      </div>
    </a>
  );
}
