export type LandingLogo = string;

export type BentoStat = {
  stat: string;
  label: string;
  sub: string;
};

export type PricingPlan = {
  name: string;
  price: string;
  period: string;
  blurb: string;
  cta: string;
  href: string;
  features: readonly string[];
  popular: boolean;
};

export type FAQItem = {
  q: string;
  a: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  title: string;
  initials: string;
  avatarBg: string;
};
