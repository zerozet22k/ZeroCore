"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cube";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "./HeroSlider.css";

import { EffectCube, Navigation, Pagination, Autoplay } from "swiper/modules";
import { LanguageJson, getTranslatedText } from "@/utils/getTranslatedText";
import { useLanguage } from "@/hooks/useLanguage";
import { TextAlign } from "@/config/CMS/settings";

export interface Slide {
  images: {
    desktop?: string;
    tablet?: string;
    mobile?: string;
  };
  header: LanguageJson;
  description?: LanguageJson;
  textAlign: TextAlign;
}

interface HeroSliderProps {
  slides: Slide[];
  delay: number;
}

const HeroSlider: React.FC<HeroSliderProps> = ({ slides, delay }) => {
  const { language } = useLanguage(); // Get the current language dynamically

  return (
    <div className="swiper-wrapper no-select">
      <Swiper
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={1}
        autoplay={{ delay: delay, disableOnInteraction: false }}
        loop={true}
        navigation
        pagination={{ clickable: true }}
        modules={[EffectCube, Navigation, Pagination, Autoplay]}
        className="swiper-container"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="slide-content">
              <picture>
                <source
                  media="(min-width: 1024px)"
                  srcSet={slide.images.desktop}
                />
                <source
                  media="(min-width: 768px)"
                  srcSet={slide.images.tablet}
                />
                <source
                  media="(max-width: 767px)"
                  srcSet={slide.images.mobile}
                />
                <img
                  src={slide.images.mobile}
                  alt={`Slide Index`}
                  className="slide-image"
                />
              </picture>
              <div className={`slide-info ${slide.textAlign}`}>
                <h2>{getTranslatedText(slide.header, language)}</h2>
                {slide.description && (
                  <p>{getTranslatedText(slide.description, language)}</p>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroSlider;
