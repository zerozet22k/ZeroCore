"use client";

import React from "react";
import { Carousel } from "antd";
import "@/styles/carousel.css";

interface CustomCarouselProps {
  children: React.ReactNode;
  slidesToShow?: number;
  autoplay?: boolean;
  autoplaySpeed?: number;
  infinite?: boolean;
  dots?: boolean;
  arrowColor?: string;
  dotColor?: string;
  dotActiveColor?: string;
}

const defaultResponsiveSettings = [
  { breakpoint: 1024, slidesToShow: 3 },
  { breakpoint: 768, slidesToShow: 2 },
  { breakpoint: 576, slidesToShow: 1 },
];

const CustomCarousel: React.FC<CustomCarouselProps> = ({
  children,
  slidesToShow = 3,
  autoplay = true,
  autoplaySpeed = 2000,
  infinite = true,
  dots = true,
  arrowColor = "black",
  dotColor = "#d9d9d9",
  dotActiveColor = "red",
}) => {
  const carouselStyles = {
    "--arrow-color": arrowColor,
    "--dot-color": dotColor,
    "--dot-active-color": dotActiveColor,
  } as React.CSSProperties;

  return (
    <div style={{ position: "relative", padding: "0", ...carouselStyles }}>
      <Carousel
        autoplay={autoplay}
        autoplaySpeed={autoplaySpeed}
        dots={dots}
        infinite={infinite}
        slidesToShow={slidesToShow}
        swipeToSlide
        responsive={defaultResponsiveSettings.map((setting) => ({
          breakpoint: setting.breakpoint,
          settings: { slidesToShow: setting.slidesToShow },
        }))}
        style={{ padding: "50px 20px" }}
      >
        {children}
      </Carousel>
    </div>
  );
};

export default CustomCarousel;
