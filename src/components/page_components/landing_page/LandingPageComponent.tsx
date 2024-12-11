"use client";
import { useAnimation } from "framer-motion";
import { useEffect, useCallback } from "react";
import Section2 from "./Section2";
import Section3 from "./Section3";

export default function LandingPageComponent() {
  const controlsSection2 = useAnimation();
  const controlsSection3 = useAnimation();

  const handleScroll = useCallback(() => {
    const sections = document.querySelectorAll("section");
    const scrollY = window.scrollY + window.innerHeight;

    sections.forEach((section, index) => {
      const controls = [controlsSection2, controlsSection3][index];
      const offsetTop = section.offsetTop;
      const offsetHeight = section.offsetHeight;

      if (scrollY > offsetTop + offsetHeight / 2) {
        controls.start("visible");
      } else {
        controls.start("hidden");
      }
    });
  }, [controlsSection2, controlsSection3]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div>
      <Section2 controls={controlsSection2} />
      <Section3 controls={controlsSection3} />
    </div>
  );
}
