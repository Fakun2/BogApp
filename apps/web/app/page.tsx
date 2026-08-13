import { Hero } from "@/components/landing/hero/hero";
import { LogoStrip } from "@/components/landing/logo-strip/logo-strip";
import { LandingContainer, LandingSection } from "@/components/landing/ui/landing-section";
import dynamic from "next/dynamic";

function LandingSectionFallback({ height = "min-h-[420px]" }: { height?: string }) {
  return (
    <LandingSection aria-hidden="true">
      <LandingContainer>
        <div className={`${height} animate-pulse rounded-[1.6rem] border border-border bg-background`} />
      </LandingContainer>
    </LandingSection>
  );
}

const Features = dynamic(() => import("@/components/landing/features/features").then((mod) => mod.Features), {
  loading: () => <LandingSectionFallback height="min-h-[760px]" />
});

const Workflow = dynamic(() => import("@/components/landing/workflow/workflow").then((mod) => mod.Workflow), {
  loading: () => <LandingSectionFallback height="min-h-[680px]" />
});

const Showcase = dynamic(() => import("@/components/landing/showcase/showcase").then((mod) => mod.Showcase), {
  loading: () => <LandingSectionFallback height="min-h-[560px]" />
});

const Stats = dynamic(() => import("@/components/landing/stats/stats").then((mod) => mod.Stats), {
  loading: () => <LandingSectionFallback height="min-h-40" />
});

const Testimonials = dynamic(
  () => import("@/components/landing/testimonials/testimonials").then((mod) => mod.Testimonials),
  {
    loading: () => <LandingSectionFallback height="min-h-[520px]" />
  }
);

const FAQ = dynamic(() => import("@/components/landing/faq/faq").then((mod) => mod.FAQ), {
  loading: () => <LandingSectionFallback height="min-h-[520px]" />
});

const FinalCTA = dynamic(() => import("@/components/landing/cta/cta").then((mod) => mod.FinalCTA), {
  loading: () => <LandingSectionFallback height="min-h-[460px]" />
});

const Footer = dynamic(() => import("@/components/landing/footer/footer").then((mod) => mod.Footer), {
  loading: () => <div aria-hidden="true" className="h-40 border-t border-border bg-background" />
});

export default function HomePage() {
  return (
    <main className="h-svh overflow-y-auto bg-card text-foreground">
      <Hero />
      <LogoStrip />
      <Features />
      <Workflow />
      <Showcase />
      <Stats />
      <Testimonials />
      {/* <Pricing /> */}
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
