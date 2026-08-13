import Link from "next/link";
import { Check } from "lucide-react";
import { pricing } from "../data/landing-data";
import { LandingContainer, LandingSection } from "../ui/landing-section";
import { SectionEyebrow } from "../ui/section-eyebrow";

export function Pricing() {
  return (
    <LandingSection id="pricing">
      <LandingContainer>
        <div className="mx-auto max-w-3xl text-center">
          <SectionEyebrow>Planes</SectionEyebrow>
          <h2 className="text-4xl font-semibold leading-tight tracking-normal sm:text-6xl">
            Simple para empezar. Solido para crecer.
          </h2>
          <p className="mt-5 text-base leading-7 text-muted-foreground">
            Elegi entre validar un MVP privado, operar un estudio o preparar una instalacion propia.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {pricing.map((plan) => (
            <article
              key={plan.name}
              className={`relative rounded-[1.6rem] border p-6 shadow-[var(--landing-soft-shadow)] ${
                plan.popular
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background"
              }`}
            >
              {plan.popular && (
                <span className="absolute right-5 top-5 rounded-full bg-primary-foreground px-3 py-1 text-xs font-medium text-primary">
                  Recomendado
                </span>
              )}
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p
                className={`mt-3 text-sm leading-6 ${
                  plan.popular ? "text-primary-foreground/75" : "text-muted-foreground"
                }`}
              >
                {plan.blurb}
              </p>
              <div className="mt-8 flex items-end gap-2">
                <span className="text-5xl font-semibold">{plan.price}</span>
                <span
                  className={`pb-2 text-sm ${
                    plan.popular ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  {plan.period}
                </span>
              </div>
              <ul className="mt-8 space-y-3 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="h-4 w-4" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`mt-8 inline-flex h-11 w-full items-center justify-center rounded-full text-sm font-medium ${
                  plan.popular
                    ? "bg-primary-foreground text-primary"
                    : "border border-border bg-card text-foreground"
                }`}
              >
                {plan.cta}
              </Link>
            </article>
          ))}
        </div>
      </LandingContainer>
    </LandingSection>
  );
}
