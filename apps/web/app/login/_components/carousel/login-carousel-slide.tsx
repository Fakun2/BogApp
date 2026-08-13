import type { LoginCarouselSlide } from "../../_types/login.types";

type LoginCarouselSlideProps = {
  slide: LoginCarouselSlide;
};

export function LoginCarouselSlide({ slide }: LoginCarouselSlideProps) {
  return (
    <article className="relative h-full overflow-hidden">
      <img
        alt={slide.title}
        className="h-full w-full object-cover"
        draggable={false}
        src={slide.image}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/18 to-black/10" />
      <div className="absolute bottom-20 left-14 z-10 max-w-[420px] text-white">
        <h2 className="text-5xl font-semibold leading-none tracking-normal">{slide.title}</h2>
        <p className="mt-5 max-w-[340px] text-sm font-medium leading-6 text-white/78">
          {slide.subtitle}
        </p>
      </div>
    </article>
  );
}
