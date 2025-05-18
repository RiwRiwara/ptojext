"use client";
import { useAnimation } from "framer-motion";
import { useEffect, useCallback, useState, lazy, Suspense } from "react";
import { FaPlayCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@heroui/card";
import { isMobileOrLowSpec } from "@/utils/deviceDetection";
import { useTranslation } from "react-i18next";
// Lazy load heavy components for better initial loading performance
const ClothPhysic = lazy(() => import("./ClothPhysic"));
const Section3 = lazy(() => import("./Section3"));

export default function LandingPageComponent() {
  const controlsSection2 = useAnimation();
  const controlsSection3 = useAnimation();
  const [activeTab, setActiveTab] = useState(0);
  const [isLowPerformanceDevice, setIsLowPerformanceDevice] = useState(false);
  const { t } = useTranslation("landingPageTranslations");
  // Check for low performance device on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLowPerformanceDevice(isMobileOrLowSpec());
    }
  }, []);

  const handleScroll = useCallback(() => {
    // Throttle scroll events on low-performance devices
    if (isLowPerformanceDevice) {
      // Skip animation on low-performance devices to conserve resources
      // Just make all controls visible after a short delay
      setTimeout(() => {
        controlsSection2.start("visible");
        controlsSection3.start("visible");
      }, 1000);
      return;
    }

    const sections = document.querySelectorAll("section");
    const scrollY = window.scrollY + window.innerHeight;
    const controlsArray = [controlsSection2, controlsSection3];

    sections.forEach((section, index) => {
      if (index < controlsArray.length) {
        const controls = controlsArray[index];
        const offsetTop = section.offsetTop;
        const offsetHeight = section.offsetHeight;
        if (scrollY > offsetTop + offsetHeight / 3) {
          controls.start("visible");
        } else {
          controls.start("hidden");
        }
      }
    });
  }, [controlsSection2, controlsSection3, isLowPerformanceDevice]);

  useEffect(() => {
    // On mobile/low-spec, use passive event listener and throttle scroll events
    if (isLowPerformanceDevice) {
      let lastScroll = 0;
      const throttledScroll = () => {
        const now = Date.now();
        if (now - lastScroll > 200) {
          // 200ms throttle for low-performance devices
          handleScroll();
          lastScroll = now;
        }
      };

      window.addEventListener("scroll", throttledScroll, { passive: true });
      return () => window.removeEventListener("scroll", throttledScroll);
    } else {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll, isLowPerformanceDevice]);

  // Features data for tabs
  const featuresData = [
    {
      title: t("algo-visual"),
      description: t("algo-visual-sub"),
      features: [
        {
          icon: "🔍",
          title: t("pathfind"),
          description: t("pathfind-sub"),
        },
        {
          icon: "📊",
          title: t("sorting"),
          description: t("sorting-sub"),
        },
        {
          icon: "🌳",
          title: t("data-struct"),
          description: t("data-struct-sub"),
        },
      ],
    },

    {
      title: t("ai"),
      description: t("ai-sub"),
      features: [
        {
          icon: "🧠",
          title: t("nn"),
          description: t("nn-sub"),
        },
        {
          icon: "🤖",
          title: t("ml"),
          description: t("ml-sub"),
        },
        {
          icon: "🎮",
          title: t("rein"),
          description: t("rein-sub"),
        },
      ],
    },
    {
      title: t("physics"),
      description: t("physics-sub"),
      features: [
        {
          icon: "✂️",
          title: t("cutting"),
          description: t("cutting-sub"),
        },
        {
          icon: "🧲",
          title: t("pins"),
          description: t("pins-sub"),
        },
        {
          icon: "🎚️",
          title: t("controls"),
          description: t("controls-sub"),
        },
      ],
    },
  ];

  return (
    <div className="relative overflow-x-hidden">
      {/* Subtle background pattern */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 -z-10 "
        style={{
          backgroundImage:
            "radial-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px), radial-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 10px 10px",
          minHeight: "100vh",
        }}
      />

      {/* INTRO SECTION */}
      <section className="py-4 flex flex-col items-center text-center gap-6">
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-[#83AFC9] to-[#83AFC9] text-white px-5 py-2 rounded-full text-sm md:text-xl font-medium mb-4"
        >
          {t("intro-button")}
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm md:text-lg max-w-2xl mx-6 md:mx-auto text-gray-700 leading-relaxed"
        >
          {t("intro-sub")}
        </motion.p>
      </section>

      {/* FEATURES TAB SECTION */}
      <section id="features" className="py-10 px-4 max-w-6xl mx-auto">
        <motion.div
          className="bg-white   rounded-2xl shadow-md p-8 mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Tabs */}
          <div className="flex justify-center mb-10 overflow-x-auto pb-2 ">
            <div className="inline-flex flex-col md:flex-row p-1 rounded-lg bg-primary-50 w-full justify-between ">
              {featuresData.map((feature, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`relative px-6 py-2 text-xs md:text-lg text-nowrap font-medium rounded-lg transition-all duration-200 ${
                    activeTab === index
                      ? "bg-white text-[#527387] shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {feature.title}
                  {activeTab === index && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#527387]"
                      layoutId="activeTab"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {featuresData[activeTab].title}
                </h2>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  {featuresData[activeTab].description}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mt-10">
                {featuresData[activeTab].features.map(
                  (feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: featureIndex * 0.1 }}
                    >
                      <Card className="p-6 flex flex-col items-center text-center h-full  duration-300 ease-soft-spring">
                        <div className="text-4xl mb-4">{feature.icon}</div>
                        <h3 className="font-bold text-xl mb-2 text-gray-800">
                          {feature.title}
                        </h3>
                        <p className="text-gray-700">{feature.description}</p>
                      </Card>
                    </motion.div>
                  )
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Cloth Simulation */}
        <div className="py-6 mt-4">
          {/* Header Section */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-2xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#83AFC9] to-blue-900 mb-4 mt-2 md:mt-16"
            >
              {t("cloth")}
            </motion.h1>
            <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto font-medium">
              {t("cloth-sub")}
            </p>
          </motion.div>

          {/* Featured Experience Section */}
          <div className="relative mb-0">
            <div className="absolute inset-0 bg-[#83AFC9] rounded-3xl transform -rotate-2"></div>

            <motion.div
              className="relative bg-white backdrop-blur-md rounded-2xl shadow-lg p-8 md:p-12 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div>
                  <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                    Featured Simulation
                  </span>
                  <h2 className="text-lg md:text-2xl font-bold text-[#83AFC9] mb-4">
                    {t("realistic-cloth")}
                  </h2>
                  <p className="text-gray-700 text-sm md:text-lg mb-6">
                    {t("realistic-cloth-sub")}
                  </p>

                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center gap-3">
                      <div className="p-1.5 bg-green-100 rounded-full text-green-800">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-700 font-medium">
                        {t("realistic-cloth-1")}
                      </p>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="p-1.5 bg-green-100 rounded-full text-green-800">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-700 font-medium">
                        {t("realistic-cloth-2")}
                      </p>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="p-1.5 bg-green-100 rounded-full text-green-800">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-700 font-medium">
                        {t("realistic-cloth-3")}
                      </p>
                    </li>
                  </ul>
                </div>

                {/* Simulation Canvas */}
                <div className="relative">
                  <Suspense
                    fallback={
                      <div className="w-full h-80 bg-gray-100 animate-pulse rounded-lg"></div>
                    }
                  >
                    <ClothPhysic controls={controlsSection2} />
                  </Suspense>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Existing sections Section3) */}
      <Suspense
        fallback={
          <div className="w-full h-64 bg-gray-100 animate-pulse rounded-md"></div>
        }
      >
        <Section3 controls={controlsSection3} />
      </Suspense>
    </div>
  );
}
