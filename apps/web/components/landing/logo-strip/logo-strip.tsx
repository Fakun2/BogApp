import { logos } from "../data/landing-data";

export function LogoStrip() {
  return (
    <section className="border-y border-border bg-card py-4">
      <p className="text-center text-xs uppercase tracking-[0.34em] text-muted-foreground sm:text-sm">
        Trabajamos junto a
      </p>
      <div className="mx-auto mt-12 max-w-none overflow-hidden [mask-image:var(--landing-mask-fade-x)]">
        <div className="lumina-marquee lumina-logo-track text-3xl font-medium leading-none text-muted-foreground/75 sm:text-4xl">
          {[...logos, ...logos].map((name, index) => (
            <span
              key={`${name}-${index}`}
              className="whitespace-nowrap font-serif tracking-normal transition-colors hover:text-muted-foreground/70 "
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
