"use client";
import { motion, AnimationControls } from "framer-motion";

interface Section1Props {
  controls: AnimationControls;
}

export default function Section1({ controls }: Section1Props) {
  const fadeInVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
    pageLoad: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="h-screen flex items-center justify-center">
      <motion.div
        className="text-center"
        initial="hidden"
        animate={controls ? controls : "pageLoad"}
        variants={fadeInVariants}
      >
        <h1 className="text-7xl font-bold mb-8">AI LAB</h1>
        <p className="text-xl">Welcome to the future of technology.</p>
      </motion.div>
    </section>
  );
}
