"use client";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FcRadarPlot,
  FcStackOfPhotos,
  FcCollect,
  FcOrgUnit,
} from "react-icons/fc";
import Image from "next/image";
import {
  isMobileOrLowSpec,
  getOptimalAnimationSettings,
} from "@/utils/deviceDetection";
import { useTranslation } from "react-i18next";

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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLowPerformanceDevice, setIsLowPerformanceDevice] = useState(false);
  const { t } = useTranslation("landingPageTranslations");
  // Get optimal animation settings based on device capability
  const animationSettings = useMemo(() => {
    return getOptimalAnimationSettings();
  }, []);

  useEffect(() => {
    setIsClient(true);
    setIsLowPerformanceDevice(isMobileOrLowSpec());

    // Throttled mouse move handler for better performance
    let lastMove = 0;
    const throttleDelay = isLowPerformanceDevice ? 150 : 50; // Higher throttle on mobile

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMove > throttleDelay) {
        setMousePosition({ x: e.clientX, y: e.clientY });
        lastMove = now;
      }
    };

    // Only add mouse tracking on non-mobile devices to save performance
    if (!isLowPerformanceDevice) {
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [isLowPerformanceDevice]);

  if (!isClient) return null; // Prevent SSR mismatches

  return (
    <AnimatePresence>
      <motion.main
        className="h-screen flex items-center justify-center md:-mt-24 -mt-44 relative overflow-hidden"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={containerVariants}
        viewport={{ once: true }} // Only animate once when in view
      >
        {/* Dynamic gradient - simplified on mobile */}
        {!isLowPerformanceDevice ? (
          <motion.div
            className="absolute inset-0 opacity-30 -z-10 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.2) 0%, rgba(79, 70, 229, 0.1) 25%, transparent 50%)`,
            }}
            animate={{ opacity: [0.2, 0.3, 0.2] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ) : (
          // Static gradient for mobile/low-performance devices
          <div
            className="absolute inset-0 opacity-25 -z-10 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.2) 0%, rgba(79, 70, 229, 0.1) 25%, transparent 50%)`,
            }}
          />
        )}

        {/* Hero content */}
        <motion.div
          className="text-center relative z-[5]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="hidden">VISUALRIGHT</h1>
          <motion.div
            className="flex flex-col items-center justify-center gap-8"
            variants={itemVariants}
          >
            <motion.div
              className="ease-soft-spring"
              variants={itemVariants}
              whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
              transition={{ rotate: { repeat: Infinity, duration: 0.5 } }}
            >
              <Image
                src="/logo/logo-full.png"
                width={150}
                height={150}
                alt="VISUALRIGHT logo"
                className="animate-appearance-in drop-shadow-xl mt-12 md:mt-0 w-32 h-32 md:w-48 md:h-48"
                priority
              />
            </motion.div>

            <motion.div className="relative px-10" variants={itemVariants}>
              <motion.span
                className="default-blue font-bold flex flex-row justify-center gap-1 md:gap-2 text-4xl md:text-7xl"
                variants={containerVariants}
              >
                {["V", "I", "S", "U", "A", "L", "R", "I", "G", "H", "T"].map(
                  (letter, index) => (
                    <motion.span
                      key={index}
                      className="hover:text-sky-950 hover:drop-shadow-lg duration-300 cursor-default"
                      variants={letterVariants}
                      // Disable hover animations on mobile for better performance
                      {...(!isLowPerformanceDevice && {
                        whileHover: { scale: 1.3, y: -5 },
                      })}
                    >
                      {letter}
                    </motion.span>
                  )
                )}
              </motion.span>
              <motion.div
                className="h-1 w-0 bg-gradient-to-r from-sky-700 via-[#83AFC9] to-sky-50 mx-auto rounded-full mt-3"
                // Simpler animation for mobile
                animate={{
                  width: isLowPerformanceDevice ? "60%" : ["0%", "80%", "60%"],
                }}
                transition={{
                  duration: isLowPerformanceDevice ? 1 : 2,
                  delay: isLowPerformanceDevice ? 0.5 : 1,
                }}
              />
            </motion.div>

            <motion.p
              className="text-sm px-2 md:px-0 text-gray-600 max-w-lg mt-2 md:mt-6 leading-relaxed md:text-2xl "
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              {t("intro")}
            </motion.p>

            <motion.div
              className="mt-2 md:mt-8 flex gap-2 md:gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.6 }}
            >
              <motion.button
                className="text-sm md:text-base px-6 py-3 bg-[#83AFC9] text-white rounded-full font-medium shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  window.scrollTo({
                    top: window.innerHeight * 0.8,
                    behavior: "smooth",
                  })
                }
              >
                {t("explore-button")}
              </motion.button>
              <motion.a
                href="/about"
                className="text-sm md:text-base px-6 py-3 border-2 border-[#83AFC9] text-[#83AFC9] rounded-full font-medium hover:bg-[#83AFC9] hover:text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {t("about-button")}
              </motion.a>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Floating elements decoration - hidden on low performance devices */}
        {!isLowPerformanceDevice && (
          <>
            <motion.div
              className="absolute top-20 right-20 w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 opacity-20 blur-xl"
              animate={{ y: [0, -20, 0], opacity: [0.2, 0.3, 0.2] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
            <motion.div
              className="absolute bottom-40 left-20 w-24 h-24 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 blur-xl"
              animate={{ y: [0, 20, 0], opacity: [0.2, 0.25, 0.2] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </>
        )}
      </motion.main>
    </AnimatePresence>
  );
}
