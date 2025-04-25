"use client";
import { useAnimation } from "framer-motion";
import { useEffect, useCallback } from "react";
import Section2 from "./Section2";
import Section3 from "./Section3";

import { FaRobot, FaChartBar, FaBrain, FaPlayCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { Button } from "@nextui-org/button";
import { Card } from "@heroui/card";

export default function LandingPageComponent() {
  const controlsSection2 = useAnimation();
  const controlsSection3 = useAnimation();

  const handleScroll = useCallback(() => {
    const sections = document.querySelectorAll("section");
    const scrollY = window.scrollY + window.innerHeight;
    const controlsArray = [controlsSection2, controlsSection3];

    sections.forEach((section, index) => {
      if (index < controlsArray.length) {
        const controls = controlsArray[index];
        const offsetTop = section.offsetTop;
        const offsetHeight = section.offsetHeight;
        if (scrollY > offsetTop + offsetHeight / 2) {
          controls.start("visible");
        } else {
          controls.start("hidden");
        }
      }
    });
  }, [controlsSection2, controlsSection3]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="relative overflow-x-hidden">
      {/* Animated background gradient */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 -z-10 animate-gradient-move"
        style={{ minHeight: "100vh" }}
      />
      {/* HERO SECTION */}
      <section className="py-12 flex flex-col items-center text-center gap-6 bg-white">
        <motion.h1
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold"
        >
          Features
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-md md:text-lg max-w-2xl mx-6 md:mx-auto text-gray-700"
        >
          Interactive playground to learn, simulate, and visualize complex concepts.
          Built for students, educators, and the curious.
        </motion.p>
      </section>
      {/* FEATURES SECTION */}
      <section id="features" className="py-10 px-4 max-w-6xl mx-auto bg-white">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 flex flex-col items-center text-center drop-shadow-[2px_2px_6px_rgb(59_130_246_/_0.3)]">
            <FaRobot size={36} className="text-blue-500 mb-4" />
            <h3 className="font-bold text-xl mb-2">AI Playground</h3>
            <p className="text-gray-700">Experiment with AI algorithms and see how they work in real-time.</p>
          </Card>
          <Card className="p-6 flex flex-col items-center text-center drop-shadow-[2px_2px_6px_rgb(147_51_234_/_0.3)]">
            <FaChartBar size={36} className="text-purple-500 mb-4" />
            <h3 className="font-bold text-xl mb-2">Data Structure Visualizer</h3>
            <p className="text-gray-700">Visualize and interact with trees, graphs, and more for deeper understanding.</p>
          </Card>
          <Card className="p-6 flex flex-col items-center text-center drop-shadow-[2px_2px_6px_rgb(236_72_153_/_0.3)]">
            <FaBrain size={36} className="text-pink-500 mb-4" />
            <h3 className="font-bold text-xl mb-2">Algorithm Simulation</h3>
            <p className="text-gray-700">Step through algorithms and animations to learn by doing.</p>
          </Card>
        </div>
      </section>
      {/* WHAT YOU'LL LEARN / TESTIMONIALS SECTION */}
      <section className="py-10 px-4 max-w-6xl mx-auto bg-white">
        <h2 className="text-3xl font-semibold text-center mb-10">What You’ll Learn</h2>
        <div className="flex flex-wrap justify-center gap-8">
          <Card className="p-6 w-[350px] drop-shadow-[2px_2px_6px_rgb(59_130_246_/_0.3)]">
            <h3 className="font-semibold text-xl mb-2">Visual Learning</h3>
            <p className="text-gray-700">See how algorithms work step-by-step with animations.</p>
          </Card>
          <Card className="p-6 w-[350px] drop-shadow-[2px_2px_6px_rgb(147_51_234_/_0.3)]">
            <h3 className="font-semibold text-xl mb-2">Hands-On Practice</h3>
            <p className="text-gray-700">Interact with data structures and AI models directly.</p>
          </Card>
          <Card className="p-6 w-[350px] drop-shadow-[2px_2px_6px_rgb(236_72_153_/_0.3)]">
            <h3 className="font-semibold text-xl mb-2">For All Levels</h3>
            <p className="text-gray-700">Whether beginner or advanced, there’s something for everyone.</p>
          </Card>
        </div>
      </section>
      {/* Existing sections (Section2, Section3) */}
      <Section2 controls={controlsSection2} />
      <Section3 controls={controlsSection3} />
    </div>
  );
}
