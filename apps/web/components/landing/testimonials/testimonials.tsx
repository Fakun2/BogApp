import { Quote } from "lucide-react";
import { testimonials } from "../data/landing-data";
import { SectionEyebrow } from "../ui/section-eyebrow";

export function Testimonials() {
  return (
    <section className="bg-card py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <SectionEyebrow>Clientes</SectionEyebrow>
          <h2 className="text-4xl font-semibold leading-tight tracking-normal sm:text-6xl">
            Para equipos que viven de cumplir plazos.
          </h2>
          <div className="mt-7 flex justify-center -space-x-2">
            {testimonials.map((item) => (
              <span
                key={item.initials}
                className={`flex h-10 w-10 items-center justify-center rounded-full border border-background text-xs font-semibold ${item.avatarBg}`}
              >
                {item.initials}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Pilotos privados y pruebas de volumen</p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {testimonials.map((item) => (
            <article
              key={item.name}
              className="rounded-[1.6rem] border border-border bg-card p-6 shadow-[var(--landing-soft-shadow)]"
            >
              <Quote className="h-5 w-5 text-primary" />
              <p className="mt-5 text-base leading-7">"{item.quote}"</p>
              <div className="mt-6 flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold ${item.avatarBg}`}
                >
                  {item.initials}
                </span>
                <div>
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.title}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
