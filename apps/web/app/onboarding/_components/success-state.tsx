import { CheckCircle2 } from "lucide-react";
import { VisualTile } from "./visual-tile";

type SuccessStateProps = {
  result: {
    tenantId: string;
    userId: string;
  };
};

export function SuccessState({ result }: SuccessStateProps) {
  return (
    <div className="grid gap-6">
      <div className="rounded-2xl border border-border bg-secondary/70 p-6">
        <CheckCircle2 className="h-10 w-10 text-primary" />
        <h2 className="mt-5 text-2xl font-semibold">Estudio creado</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          El tenant quedo activo y tu usuario ya tiene acceso como owner.
        </p>
      </div>
      <div className="grid gap-3 text-sm md:grid-cols-2">
        <VisualTile label="Tenant ID" value={result.tenantId} />
        <VisualTile label="User ID" value={result.userId} />
      </div>
    </div>
  );
}
