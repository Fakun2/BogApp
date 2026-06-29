"use client";

import { useEffect, useState } from "react";
import type { CarouselApi } from "@/components/ui/carousel";

const loginCarouselAutoplayMs = 5500;

export function useLoginCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    const updateCurrentIndex = () => setCurrentIndex(api.selectedScrollSnap());

    updateCurrentIndex();
    api.on("select", updateCurrentIndex);

    return () => {
      api.off("select", updateCurrentIndex);
    };
  }, [api]);

  useEffect(() => {
    if (!api) {
      return;
    }

    const interval = window.setInterval(() => {
      api.scrollNext();
    }, loginCarouselAutoplayMs);

    return () => window.clearInterval(interval);
  }, [api]);

  function scrollTo(index: number) {
    api?.scrollTo(index);
  }

  return {
    currentIndex,
    scrollTo,
    setApi
  };
}
