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
        className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 animate-gradient-move"
        style={{ minHeight: "100vh" }}
      />
      {/* HERO SECTION */}
      <section className="py-12 flex flex-col items-center text-center gap-6">
        <motion.h1
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
        >
          Features
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg max-w-2xl mx-auto text-gray-700"
        >
          Interactive playground to learn, simulate, and visualize complex concepts.
          Built for students, educators, and the curious.
        </motion.p>
      </section>
      {/* FEATURES SECTION */}
      <section id="features" className="py-10 px-4 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 flex flex-col items-center text-center shadow-xl">
            <FaRobot size={36} className="text-blue-500 mb-4" />
            <h3 className="font-bold text-xl mb-2">AI Playground</h3>
            <p>Experiment with AI algorithms and see how they work in real-time.</p>
          </Card>
          <Card className="p-6 flex flex-col items-center text-center shadow-xl">
            <FaChartBar size={36} className="text-purple-500 mb-4" />
            <h3 className="font-bold text-xl mb-2">Data Structure Visualizer</h3>
            <p>Visualize and interact with trees, graphs, and more for deeper understanding.</p>
          </Card>
          <Card className="p-6 flex flex-col items-center text-center shadow-xl">
            <FaBrain size={36} className="text-pink-500 mb-4" />
            <h3 className="font-bold text-xl mb-2">Algorithm Simulation</h3>
            <p>Step through algorithms and animations to learn by doing.</p>
          </Card>
        </div>
      </section>
      {/* WHAT YOU'LL LEARN / TESTIMONIALS SECTION */}
      <section className="py-10 px-4 max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-10">What You’ll Learn</h2>
        <div className="flex flex-wrap justify-center gap-6">
          <Card className="p-4 w-72 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
            <div className="font-semibold mb-1">Visual Learning</div>
            <div className="text-sm text-gray-700">See how algorithms work step-by-step with animations.</div>
          </Card>
          <Card className="p-4 w-72 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
            <div className="font-semibold mb-1">Hands-On Practice</div>
            <div className="text-sm text-gray-700">Interact with data structures and AI models directly.</div>
          </Card>
          <Card className="p-4 w-72 bg-gradient-to-r from-pink-50 to-blue-50 border border-pink-200">
            <div className="font-semibold mb-1">For All Levels</div>
            <div className="text-sm text-gray-700">Whether beginner or advanced, there’s something for everyone.</div>
          </Card>
        </div>
      </section>
      {/* Existing sections (Section2, Section3) */}
      <Section2 controls={controlsSection2} />
      <Section3 controls={controlsSection3} />
    </div>
  );
}
