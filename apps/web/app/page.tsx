import { FinalCTA } from "@/components/landing/cta/cta";
import { FAQ } from "@/components/landing/faq/faq";
import { Features } from "@/components/landing/features/features";
import { Footer } from "@/components/landing/footer/footer";
import { Hero } from "@/components/landing/hero/hero";
import { LogoStrip } from "@/components/landing/logo-strip/logo-strip";
import { Pricing } from "@/components/landing/pricing/pricing";
import { Showcase } from "@/components/landing/showcase/showcase";
import { Stats } from "@/components/landing/stats/stats";
import { Testimonials } from "@/components/landing/testimonials/testimonials";
import { Workflow } from "@/components/landing/workflow/workflow";

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
