import { LandingContainer, LandingSection } from "../ui/landing-section";

export function Stats() {
  return (
    <LandingSection padding="compact" className="text-foreground">
      <LandingContainer className="sm:flex sm:flex-row sm:justify-between sm:items-center sm:gap-8 sm:text-center grid grid-cols-2 gap-8">
        {[
          ["100k+", "Expedientes"],
          ["99.9%", "Disponibilidad de sistema"],
          ["3", "Capas de seguridad"],
          ["12x", "Mas rapido que herramientas tradicionales"]
        ].map(([number, label]) => (
          <div key={label}>
            <p className="text-4xl font-semibold">{number}</p>
            <p className="mt-2 text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
      </LandingContainer>
    </LandingSection>
  );
}
