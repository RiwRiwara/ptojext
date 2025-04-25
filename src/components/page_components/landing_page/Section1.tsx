"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FcRadarPlot,
  FcStackOfPhotos,
  FcCollect,
  FcOrgUnit,
} from "react-icons/fc";
import Image from "next/image";

const menu_items = [
  {
    name: "Reinforcement Learning",
    description: "Learn about Reinforcement Learning",
    icon: (
      <Image
        src="/icon/rl-icon.png"
        alt="Reinforcement Learning Icon"
        width={40}
        height={40}
        // className="w-6 h-6 md:w-10 md:h-10"
      />
    ),
  },
  {
    name: "Image Processing",
    description: "Learn about Image Processing",
    icon: (
      <Image
        src="/icon/image-icon.png"
        alt="Image Processing Icon"
        width={40}
        height={40}
        // className="w-6 h-6 md:w-10 md:h-10"
      />
    ),
  },
  {
    name: "Data Structure and Algorithms",
    description: "Learn about Data Structure and Algorithms",
    icon: (
      <Image
        src="/icon/tree-icon.png"
        alt="Data Structure and Algorithms Icon"
        width={40}
        height={40}
        className="mt-1"
      />
    ),
  },
  {
    name: "Neural Network",
    description: "Learn about Neural Network",
    icon: (
      <Image
        src="/icon/network-icon.png"
        alt="Network Icon"
        width={40}
        height={40}
        // className="w-6 h-6 md:w-10 md:h-10"
      />
    ),
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Stagger the animation of children
      delayChildren: 0.3, // Delay before children animate
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
      duration: 0.5,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
      duration: 0.3,
    },
  },
};

export default function Section1() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Prevent SSR mismatches

  return (
    <AnimatePresence>
      <motion.main
        className="h-screen flex items-center justify-center md:-mt-24 -mt-44"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={containerVariants}
        viewport={{ once: true }} // Only animate once when in view
      >
        <motion.div
          className="text-start"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="hidden">VISUALRIGHT</h1>
          <motion.h2
            className="text-4xl md:text-7xl font-medium mb-4 md:mb-16 text-start flex flex-col md:flex-row gap-6 md:gap-10 items-center"
            variants={itemVariants}
          >
            <motion.div
              className="ease-soft-spring md:ml-4"
              variants={itemVariants}
              whileHover={{ scale: 1.1 }}
            >
              <Image
                src="/logo/logo-full.png"
                width={100}
                height={100}
                alt="VISUALRIGHT logo"
                className="animate-appearance-in"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <motion.span
                className="default-blue font-bold flex flex-row gap-1 md:ml-10"
                variants={containerVariants}
              >
                {["V", "I", "S", "U", "A", "L", "R", "I", "G", "H", "T"].map(
                  (letter, index) => (
                    <motion.span
                      key={index}
                      className="hover:text-sky-950 duration-400 hover:text-8xl ease-soft-spring cursor-default"
                      variants={letterVariants}
                      whileHover={{ scale: 1.2 }}
                    >
                      {letter}
                    </motion.span>
                  )
                )}
              </motion.span>
            </motion.div>
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10"
            variants={containerVariants}
          >
            {menu_items.map((item, index) => (
              <motion.div
                key={index}
                className="flex flex-row items-center gap-2 md:gap-6"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div
                  className="w-10 h-10 md:w-16 md:h-16 p-2 md:p-4 bg-white rounded-full shadow-lg"
                >
                  {item.icon}
                </motion.div>
                <motion.h2
                  className="text-md md:text-xl font-medium text-stone-500"
                  whileHover={{ color: "#666" }}
                >
                  <span dangerouslySetInnerHTML={{ __html: item.name }} />
                </motion.h2>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.main>
    </AnimatePresence>
  );
}