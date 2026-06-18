export const metadata = { title: "Encontros" };

// Stub — a área de gravações dos encontros é construída na issue #8.
export default function EncontrosPage() {
  return (
    <div className="portal-container">
      <h1 style={{ fontSize: 30, fontWeight: 900, margin: "0 0 10px" }}>
        Encontros
      </h1>
      <p style={{ color: "var(--text-mute)" }}>
        As gravações dos encontros chegam em breve.
      </p>
    </div>
  );
}
