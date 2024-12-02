"use client";
import { useAnimation } from "framer-motion";
import { useEffect } from "react";
import Section1 from "./Section1";
import Section2 from "./Section2";
import Section3 from "./Section3";

export default function TopBodySection() {
  const controlsSection1 = useAnimation();
  const controlsSection2 = useAnimation();
  const controlsSection3 = useAnimation();

  const handleScroll = () => {
    const sections = document.querySelectorAll("section");
    const scrollY = window.scrollY + window.innerHeight;

    sections.forEach((section, index) => {
      const controls = [controlsSection1, controlsSection2, controlsSection3][index];
      const offsetTop = section.offsetTop;
      const offsetHeight = section.offsetHeight;

      if (scrollY > offsetTop + offsetHeight / 2) {
        controls.start("visible");
      } else {
        controls.start("hidden");
      }
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main>
      <Section1 controls={controlsSection1} />
      <Section2 controls={controlsSection2} />
      <Section3 controls={controlsSection3} />
    </main>
  );
}
