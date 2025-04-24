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
import {
  HiOutlineCubeTransparent,
  HiOutlinePhoto,
  HiOutlineSquare3Stack3D,
} from "react-icons/hi2";
import { Card, CardHeader, CardBody, CardFooter, Chip } from "@heroui/react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const menu_items = [
  {
    name: "Reinforcement Learning",
    description: "Learn about Reinforcement Learning",
    icon: <HiOutlineCubeTransparent className="w-6 h-6 md:w-10 md:h-10" />,
    topic: "Reinforcement Learning",
  },
  {
    name: "Image Processing",
    description: "Learn about Image Processing",
    icon: <HiOutlinePhoto className="w-6 h-6 md:w-10 md:h-10" />,
    topic: "Convolution, Enchanted",
  },
  {
    name: "Data Structure and Algorithms",
    description: "Learn about Data Structure and Algorithms",
    icon: <HiOutlineSquare3Stack3D className="w-6 h-6 md:w-10 md:h-10" />,
    topic: "Sorting Algorithms",
  },
  {
    name: "Neural Network",
    description: "Learn about Neural Network",
    icon: <FcRadarPlot className="w-6 h-6 md:w-10 md:h-10" />,
    topic: "Neural Network",
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
        className="h-screen flex items-center justify-center md:-mt-24 -mt-28"
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
            className="text-4xl md:text-7xl font-bold mb-10 md:mb-16 mt-4 md:mt-0 text-start flex flex-col md:flex-row items-center"
            variants={itemVariants}
          >
            <motion.div
              className="ease-soft-spring"
              variants={itemVariants}
              whileHover={{ scale: 1.1 }}
            >
              <div id="visualright-logo" className="w-32 md:w-72 md:-ml-16">
                <DotLottieReact
                  src="https://lottie.host/602c34b3-8c02-4faf-aea8-35d05946190d/TCKE9ryBTl.lottie"
                  loop
                  autoplay
                />
              </div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <motion.span
                className="default-blue flex flex-row gap-1 md:-ml-6"
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
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="py-4">
                  <CardHeader className="pb-0 pt-2 px-4 flex-col items-start gap-2">
                    <h4 className="font-bold text-large">{item.name}</h4>
                  </CardHeader>
                  <CardBody className="overflow-visible py-2">
                    <div>
                      {item.topic.split(", ").map((topic, idx) => (
                        <Chip
                          key={idx}
                          className="text-tiny font-bold mr-1"
                          color="default"
                          variant="bordered"
                        >
                          {topic}
                        </Chip>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.main>
    </AnimatePresence>
  );
}
