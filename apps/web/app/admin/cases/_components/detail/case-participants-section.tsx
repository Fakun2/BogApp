import type { CaseDetailDto } from "../../_types/cases.types";

export function CaseParticipantsSection({
  participants
}: {
  participants: CaseDetailDto["participants"];
}) {
  return (
    <section className="mt-5 grid gap-3" aria-label="Sujetos procesales">
      <h3 className="text-sm font-semibold text-foreground">Sujetos procesales</h3>
      {participants.length ? (
        <ul className="grid gap-2">
          {participants.map((participant, index) => (
            <li
              className="grid gap-2 rounded-xl border border-border/40 bg-background/35 px-4 py-3 md:grid-cols-[1fr_auto]"
              key={participant.id ?? `${participant.displayName}-${index}`}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  {participant.displayName}
                </p>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {participant.document || "Documento sin cargar"}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {participant.email || participant.phone || "Contacto sin cargar"}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl border border-dashed border-border/50 px-4 py-6 text-center text-sm text-muted-foreground">
          Todavia no hay sujetos procesales cargados.
        </p>
      )}
    </section>
  );
}
