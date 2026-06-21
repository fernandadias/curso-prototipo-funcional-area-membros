import { Icon } from "@/components/ui/Icon";

// Embed de vídeo conforme o contrato: <Video src="..." legenda="..." />
// Suporta URL de embed (Tella, YouTube, etc.). Quando src="PLACEHOLDER",
// mostra um espaço reservado. A legenda aparece abaixo, com a tag de vídeo.
export function Video({
  src,
  legenda,
  titulo,
}: {
  src?: unknown;
  legenda?: unknown;
  titulo?: unknown;
}) {
  const url = typeof src === "string" ? src : "";
  const placeholder = !url || url === "PLACEHOLDER";
  const cap = (legenda as string) || (titulo as string) || "";

  return (
    <figure className="video">
      <div className="video-frame">
        {placeholder ? (
          <div className="video-placeholder">
            <span>Vídeo em breve</span>
          </div>
        ) : (
          <iframe
            src={url}
            title={cap || "Vídeo da aula"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        )}
      </div>
      {cap && (
        <figcaption className="video-cap">
          <span className="video-tag">
            <Icon name="play" smaller /> Vídeo
          </span>
          <span className="video-legenda">{cap}</span>
        </figcaption>
      )}
    </figure>
  );
}
