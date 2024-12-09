"use client";
import { motion, AnimationControls } from "framer-motion";
import {
  FcRadarPlot,
  FcStackOfPhotos,
  FcCollect,
  FcOrgUnit,
} from "react-icons/fc";

interface Section1Props {
  controls: AnimationControls;
}

const menu_items = [
  {
    name: "Reinforcement <br/> Learning",
    description: "Learn about Reinforcement Learning",
    icon: <FcCollect className="w-6 h-6 md:w-10 md:h-10" />,
  },
  {
    name: "Image processing",
    description: "Learn about Image processing",
    icon: <FcStackOfPhotos className="w-6 h-6 md:w-10 md:h-10" />,
  },
  {
    name: "Data Structure <br/>and Algorithms",
    description: "Learn about Data Structure and Algorithms",
    icon: <FcOrgUnit className="w-6 h-6 md:w-10 md:h-10" />,
  },
  {
    name: "Neural Network",
    description: "Learn about Neural Network",
    icon: <FcRadarPlot className="w-6 h-6 md:w-10 md:h-10" />,
  },
];

const fadeInVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  pageLoad: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Section1({ controls }: Section1Props) {
  return (
    <section className="h-screen flex items-center justify-center">
      <motion.div
        className="text-start"
        initial="hidden"
        animate={controls ? controls : "pageLoad"}
        variants={fadeInVariants}
      >
        <h1 className="text-3xl md:text-7xl font-semibold mb-4 md:mb-16 text-center">
          AI PLAYGROUND
        </h1>
        <div className="grid grid-cols-2 gap-6 md:gap-10">
          {menu_items.map((item, index) => (
            <div
              className="flex flex-row items-center gap-2 md:gap-6 hover:scale-105 duration-250 ease-soft-spring"
              key={index}
            >
              <div className="p-2 md:p-4 bg-white rounded-full shadow-lg">
                {item.icon}
              </div>
              <h2 className="text-md md:text-xl font-medium">
                {/* render html string*/}
                <span dangerouslySetInnerHTML={{ __html: item.name }} />
              </h2>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
