"use client";

import Image from "next/image";
import Link from "next/link";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface HeroSlide {
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  subtitle: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    image: "/images/hero/hero-salon.jpg",
    alt: "Cozy salon interior with leather chairs, warm pendant lights and brick walls",
    eyebrow: "Welcome to SalonBook",
    title: "Where Style Meets Comfort",
    subtitle:
      "Step into a world of expert styling, soothing treatments, and personalized care — book your favorite service in minutes.",
  },
  {
    image: "/images/hero/hero-hair.jpg",
    alt: "Stylist blow-drying a client's freshly cut hair",
    eyebrow: "Haircut & Styling",
    title: "Transform Your Look Today",
    subtitle:
      "From trendy cuts and blowouts to vibrant coloring, our stylists bring out the best in every strand.",
  },
  {
    image: "/images/hero/hero-makeup.jpg",
    alt: "Makeup artist applying a glamorous pink look",
    eyebrow: "Makeup & Skincare",
    title: "Glow Like Never Before",
    subtitle:
      "Radiant facials, flawless makeup, and premium skincare treatments tailored just for you.",
  },
];

export function HeroSlider() {
  return (
    <section aria-label="SalonBook highlights" className="w-full">
      <Swiper
        className="hero-slider h-[520px] w-full md:h-[600px] lg:h-[680px]"
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        loop
        speed={800}
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
      >
        {HERO_SLIDES.map((slide, index) => (
          <SwiperSlide key={slide.image}>
            <div className="relative h-full w-full">
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover saturate-[1.15] contrast-[1.08] brightness-[1.03]"
              />
              {/* Readability overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />

              {/* Slide content */}
              <div className="absolute inset-0">
                <div className="mx-auto flex h-full w-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8">
                  <div className="max-w-2xl">
                    <span className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-white uppercase backdrop-blur-sm">
                      {slide.eyebrow}
                    </span>
                    <h1 className="font-heading mt-5 text-4xl font-semibold tracking-tight text-white drop-shadow-sm sm:text-5xl lg:text-6xl">
                      {slide.title}
                    </h1>
                    <p className="mt-4 max-w-xl text-base leading-7 text-white/85 sm:text-lg sm:leading-8">
                      {slide.subtitle}
                    </p>
                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      <Link
                        href="/services"
                        className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground shadow-md transition-colors hover:bg-primary/85 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px"
                      >
                        Explore Services
                      </Link>
                      <Link
                        href="/sign-up"
                        className="inline-flex h-11 items-center justify-center rounded-lg border border-white/40 bg-white/10 px-6 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white/40 active:translate-y-px"
                      >
                        Join SalonBook
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
