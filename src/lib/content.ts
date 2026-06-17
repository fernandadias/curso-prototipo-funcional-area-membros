import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// Lê o conteúdo das aulas conforme o CONTRATO-CONTEUDO.md:
//   content/modulos/NN-slug-modulo/_modulo.mdx
//   content/modulos/NN-slug-modulo/NN-slug-aula.mdx
// O slug usado nas URLs é o nome da pasta/arquivo SEM o prefixo numérico.

const CONTENT_DIR = path.join(process.cwd(), "content", "modulos");

const stripOrderPrefix = (name: string) => name.replace(/^\d+-/, "");

// Estado de publicação de uma aula:
//   "disponivel" → conteúdo no ar, página abre normalmente.
//   "chegando"   → título já listado, mas em revisão; não abre ainda.
export type LessonStatus = "disponivel" | "chegando";

// Estado de um módulo:
//   "disponivel" → módulo com aulas abertas.
//   "chegando"   → títulos das aulas listados, em revisão (não clicáveis).
//   "em-breve"   → só ementa + resultado UAU; ainda sem aulas.
export type ModuleStatus = "disponivel" | "chegando" | "em-breve";

export type LessonMeta = {
  titulo: string;
  descricao: string;
  numero: number;
  free: boolean;
  status: LessonStatus;
  previsao?: string; // ex.: "julho" — usado nos selos "Chegando"
  duracao?: string;
  slug: string;
  moduloSlug: string;
  autor: string;
  autorFoto: string;
};

// Autor padrão quando a aula não define um no frontmatter.
const AUTOR_PADRAO = { nome: "Nanda Dias", foto: "/eu-nanda-dias-cor.png" };

export type ModuleMeta = {
  titulo: string;
  descricao: string;
  numero: number;
  status: ModuleStatus;
  previsao?: string;
  uau?: string; // resultado-promessa exibido nos módulos "em-breve"
  slug: string;
  dir: string;
  aulas: LessonMeta[];
};

function readMdx(filePath: string) {
  const raw = fs.readFileSync(filePath, "utf8");
  return matter(raw);
}

export function getModules(): ModuleMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const moduleDirs = fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  const modules = moduleDirs.map((dir) => {
    const moduleSlug = stripOrderPrefix(dir);
    const metaPath = path.join(CONTENT_DIR, dir, "_modulo.mdx");
    const { data } = readMdx(metaPath);

    const lessonFiles = fs
      .readdirSync(path.join(CONTENT_DIR, dir))
      .filter((f) => f.endsWith(".mdx") && !f.startsWith("_"));

    const aulas: LessonMeta[] = lessonFiles
      .map((file) => {
        const { data: ld } = readMdx(path.join(CONTENT_DIR, dir, file));
        return {
          titulo: ld.titulo as string,
          descricao: ld.descricao as string,
          numero: Number(ld.numero),
          free: Boolean(ld.free),
          status: ((ld.status as LessonStatus) || "disponivel"),
          previsao: ld.previsao as string | undefined,
          duracao: ld.duracao as string | undefined,
          slug: stripOrderPrefix(file.replace(/\.mdx$/, "")),
          moduloSlug: moduleSlug,
          autor: (ld.autor as string) || AUTOR_PADRAO.nome,
          autorFoto: (ld.autorFoto as string) || AUTOR_PADRAO.foto,
        };
      })
      .sort((a, b) => a.numero - b.numero);

    return {
      titulo: data.titulo as string,
      descricao: data.descricao as string,
      numero: Number(data.numero),
      status: ((data.status as ModuleStatus) || "disponivel"),
      previsao: data.previsao as string | undefined,
      uau: data.uau as string | undefined,
      slug: moduleSlug,
      dir,
      aulas,
    };
  });

  return modules.sort((a, b) => a.numero - b.numero);
}

export function getLessonSource(moduloSlug: string, aulaSlug: string) {
  const modules = getModules();
  const mod = modules.find((m) => m.slug === moduloSlug);
  if (!mod) return null;

  const file = fs
    .readdirSync(path.join(CONTENT_DIR, mod.dir))
    .find(
      (f) =>
        f.endsWith(".mdx") &&
        !f.startsWith("_") &&
        stripOrderPrefix(f.replace(/\.mdx$/, "")) === aulaSlug,
    );
  if (!file) return null;

  const raw = fs.readFileSync(
    path.join(CONTENT_DIR, mod.dir, file),
    "utf8",
  );
  const meta = mod.aulas.find((a) => a.slug === aulaSlug)!;

  // Navegação prev/next dentro do módulo
  const idx = mod.aulas.findIndex((a) => a.slug === aulaSlug);
  const prev = idx > 0 ? mod.aulas[idx - 1] : null;
  const next = idx < mod.aulas.length - 1 ? mod.aulas[idx + 1] : null;

  return { raw, meta, modulo: mod, prev, next };
}

// Lista plana de todos os pares (modulo, aula) — usado no generateStaticParams.
// Só aulas disponíveis geram página; "chegando" entram apenas como título.
export function getAllLessonParams() {
  return getModules().flatMap((m) =>
    m.aulas
      .filter((a) => a.status === "disponivel")
      .map((a) => ({ modulo: m.slug, slug: a.slug })),
  );
}
