"use client";
import { useAnimation } from "framer-motion";
import { useEffect, useCallback, useState, lazy, Suspense } from "react";
import { FaPlayCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@heroui/card";
import { isMobileOrLowSpec } from "@/utils/deviceDetection";

// Lazy load heavy components for better initial loading performance
const ClothPhysic = lazy(() => import("./ClothPhysic"));
const Section3 = lazy(() => import("./Section3"));

export default function LandingPageComponent() {
  const controlsSection2 = useAnimation();
  const controlsSection3 = useAnimation();
  const [activeTab, setActiveTab] = useState(0);
  const [isLowPerformanceDevice, setIsLowPerformanceDevice] = useState(false);
  
  // Check for low performance device on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
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
        if (now - lastScroll > 200) { // 200ms throttle for low-performance devices
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
      title: "Algorithm Visualization",
      description: "Step through complex algorithms visually and understand how they work internally through our intuitive visualizations.",
      features: [
        { icon: "🔍", title: "Pathfinding", description: "Watch A* and Dijkstra's algorithms find paths in real-time" },
        { icon: "📊", title: "Sorting", description: "Compare different sorting algorithms side by side" },
        { icon: "🌳", title: "Data Structures", description: "Explore trees, graphs, and other complex structures visually" }
      ]
    },

    {
      title: "AI Experimentation",
      description: "Explore the world of AI through hands-on interactive demos that make complex concepts approachable and engaging.",
      features: [
        { icon: "🧠", title: "Neural Networks", description: "Visualize how neural networks learn and make predictions" },
        { icon: "🤖", title: "Machine Learning", description: "Train models on different datasets and see results instantly" },
        { icon: "🎮", title: "Reinforcement Learning", description: "Watch AI agents learn to solve problems through trial and error" }
      ]
    },
    {
      title: "Interactive Physics",
      description: "Experiment with our interactive cloth simulation powered by Matter.js. Control physics properties, manipulate objects, and see real-time reactions.",
      features: [
        { icon: "✂️", title: "Cutting Action", description: "Cut through the cloth with improved detection radius and visual feedback" },
        { icon: "🧲", title: "Adjustable Pins", description: "Drag and move pins at cloth corners to create different cloth behaviors" },
        { icon: "🎚️", title: "Physics Controls", description: "Adjust stiffness, friction and particle size to simulate different materials" }
      ]
    }
  ];

  return (
    <div className="relative overflow-x-hidden">
      {/* Subtle background pattern */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: 'radial-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px), radial-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 10px 10px',
          minHeight: "100vh"
        }}
      />

      {/* INTRO SECTION */}
      <section className="py-16 flex flex-col items-center text-center gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-[#83AFC9] to-blue-900 text-white px-5 py-2 rounded-full text-sm font-medium mb-4"
        >
          Interactive Learning Reimagined
        </motion.div>
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#83AFC9] to-blue-900 mb-4"
        >
          Learn Through Interaction
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-md md:text-xl max-w-2xl mx-6 md:mx-auto text-gray-700 leading-relaxed"
        >
          Our interactive playground helps you visualize and understand complex concepts
          through engaging simulations and hands-on experiences.
        </motion.p>
      </section>

      {/* FEATURES TAB SECTION */}
      <section id="features" className="py-10 px-4 max-w-6xl mx-auto">
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-8 mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Tabs */}
          <div className="flex justify-center mb-10 overflow-x-auto pb-2">
            <div className="inline-flex p-1 rounded-lg bg-gray-100">
              {featuresData.map((feature, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`relative px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === index ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  {feature.title}
                  {activeTab === index && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{featuresData[activeTab].title}</h2>
                <p className="text-gray-600 max-w-3xl mx-auto">{featuresData[activeTab].description}</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mt-10">
                {featuresData[activeTab].features.map((feature, featureIndex) => (
                  <motion.div
                    key={featureIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: featureIndex * 0.1 }}
                  >
                    <Card className="p-6 flex flex-col items-center text-center h-full drop-shadow-[2px_2px_6px_rgb(99_102_241_/_0.2)] hover:shadow-lg transition-shadow duration-300">
                      <div className="text-4xl mb-4">{feature.icon}</div>
                      <h3 className="font-bold text-xl mb-2 text-gray-900">{feature.title}</h3>
                      <p className="text-gray-700">{feature.description}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Featured Experience Section */}
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl transform -rotate-1"></div>
          <motion.div
            className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-md p-8 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="bg-indigo-100 text-indigo-800 px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">Featured Experience</div>
                <h2 className="text-3xl font-bold mb-4">Interactive Cloth Physics</h2>
                <p className="text-gray-700 mb-6">Explore our cloth simulation powered by Matter.js physics engine. Experiment with different properties to see how they affect the material behavior.</p>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <div className="p-1 bg-green-100 rounded-full text-green-800 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-700">Adjustable stiffness, friction, and particle size</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="p-1 bg-green-100 rounded-full text-green-800 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-700">
                      Apply wind and gravity
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="p-1 bg-green-100 rounded-full text-green-800 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-700">Add ball </p>
                  </li>
                </ul>

        
              </div>

              <div className="relative">
                <div className="relative">
                  <Suspense fallback={<div className="w-full h-64 bg-gray-100 animate-pulse rounded-md"></div>}>
                    <ClothPhysic controls={controlsSection2} />
                  </Suspense>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Existing sections Section3) */}
      <Suspense fallback={<div className="w-full h-64 bg-gray-100 animate-pulse rounded-md"></div>}>
        <Section3 controls={controlsSection3} />
      </Suspense>


    </div>
  );
}
