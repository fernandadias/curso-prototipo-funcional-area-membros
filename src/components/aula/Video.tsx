// Embed de vídeo conforme o contrato: <Video src="..." titulo="..." />
// Suporta URL de embed (Tella, YouTube, etc.). Quando src="PLACEHOLDER",
// mostra um espaço reservado até o vídeo real ser gravado/inserido.

export function Video({ src, titulo }: { src: string; titulo?: string }) {
  const placeholder = !src || src === "PLACEHOLDER";

  return (
    <figure className="video">
      {titulo && <figcaption className="video-cap">{titulo}</figcaption>}
      <div className="video-frame">
        {placeholder ? (
          <div className="video-placeholder">
            <span>Vídeo em breve</span>
          </div>
        ) : (
          <iframe
            src={src}
            title={titulo || "Vídeo da aula"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        )}
      </div>
    </figure>
  );
}
