"use client";
import { motion, AnimationControls } from "framer-motion";

interface Section3Props {
  controls: AnimationControls;
}

export default function Section3({ controls }: Section3Props) {
  const fadeInVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <section className="h-screen flex items-center justify-center">
      <motion.div
        className="text-center"
        initial="hidden"
        animate={controls}
        variants={fadeInVariants}
      >
        <h2 className="text-5xl font-bold mb-4">Join Us Today</h2>
        <p className="text-lg">Contact us to learn more.</p>
      </motion.div>
    </section>
  );
}
