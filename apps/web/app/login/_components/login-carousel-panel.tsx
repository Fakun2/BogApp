"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { loginCarouselSlides, loginCopy } from "../_constants/login.constants";
import { useLoginCarousel } from "../_hooks/use-login-carousel";
import { LoginCarouselSlide } from "./login-carousel-slide";

export function LoginCarouselPanel() {
  const carousel = useLoginCarousel();

  return (
    <section className="relative hidden min-h-screen overflow-hidden bg-card lg:block">
      <div className="absolute left-8 top-8 z-20 flex items-center gap-3 text-white">
        <Button
          asChild
          variant="outline"
          className="size-10 rounded-full border-border bg-background p-0 text-foreground hover:bg-secondary"
        >
          <Link href="/" aria-label={loginCopy.goHome}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <Carousel className="h-full" opts={{ loop: true }} setApi={carousel.setApi}>
        <CarouselContent className="h-screen">
          {loginCarouselSlides.map((slide) => (
            <CarouselItem key={slide.id} className="h-screen">
              <LoginCarouselSlide slide={slide} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="bottom-9 right-[104px] top-auto border-white/20 bg-white/12 text-white hover:bg-white/20 disabled:opacity-30" />
        <CarouselNext className="bottom-9 right-14 top-auto border-white/20 bg-white/12 text-white hover:bg-white/20 disabled:opacity-30" />
      </Carousel>
    </section>
  );
}
