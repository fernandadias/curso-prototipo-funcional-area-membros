import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { getAllExtraParams, getExtraSource } from "@/lib/content";
import { mdxComponents } from "@/components/aula/mdx-components";

export function generateStaticParams() {
  return getAllExtraParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getExtraSource(slug);
  if (!data) return {};
  return { title: data.meta.titulo, description: data.meta.descricao };
}

export default async function ExtraPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getExtraSource(slug);
  if (!data) notFound();

  const { content } = await compileMDX({
    source: data.raw,
    components: mdxComponents,
    options: { parseFrontmatter: true, blockJS: false },
  });

  const { meta } = data;

  return (
    <div className="aulas-container">
      <header className="aula-head">
        <div className="aula-eyebrow">
          <span className="aulas-mono">
            {meta.kicker ?? "Conteúdo extra"}
          </span>
        </div>
        <h1>{meta.titulo}</h1>
        <p className="aula-sub">{meta.descricao}</p>
      </header>
      <article className="prosa">{content}</article>
    </div>
  );
}
