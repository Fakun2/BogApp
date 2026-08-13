import { Plus } from "lucide-react";
import { faqs } from "../data/landing-data";
import { LandingContainer, LandingSection } from "../ui/landing-section";

export function FAQ() {
  return (
    <LandingSection id="faq">
      <LandingContainer size="narrow">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.34em] text-muted-foreground sm:text-sm">
            Preguntas frecuentes
          </p>
          <h2 className="mt-6 text-4xl font-thin leading-tight tracking-normal sm:text-6xl">
            FAQ
          </h2>
        </div>

        <div className="mt-12">
          {faqs.map((item) => (
            <details key={item.q} className="group border-b border-border/70 py-6 first:border-t">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left text-lg font-medium text-foreground [&::-webkit-details-marker]:hidden">
                <span>{item.q}</span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors group-open:bg-primary group-open:text-primary-foreground">
                  <Plus className="h-4 w-4 transition-transform group-open:rotate-45" />
                </span>
              </summary>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </LandingContainer>
    </LandingSection>
  );
}
