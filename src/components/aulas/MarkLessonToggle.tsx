"use client";

import { lessonKey, useProgress } from "./useProgress";
import { Icon } from "@/components/ui/Icon";

// Botão para o aluno marcar a aula como concluída ou voltar pra pendente.
export function MarkLessonToggle({
  moduloSlug,
  slug,
}: {
  moduloSlug: string;
  slug: string;
}) {
  const { mounted, isViewed, toggleViewed } = useProgress();
  const key = lessonKey(moduloSlug, slug);
  const concluida = mounted && isViewed(key);

  return (
    <button
      type="button"
      className={`mark-done ${concluida ? "on" : ""}`}
      onClick={() => toggleViewed(key)}
      aria-pressed={concluida}
    >
      <span className="mark-done-ico" aria-hidden="true">
        {concluida ? <Icon name="check" /> : <span className="mark-done-ring" />}
      </span>
      {concluida ? "Aula concluída" : "Marcar como concluída"}
    </button>
  );
}
