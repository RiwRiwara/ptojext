"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BaseLayout from "@/components/layout/BaseLayout";
import { FiBarChart2, FiInfo, FiTarget, FiCode, FiArrowRight } from "react-icons/fi";
import { FaBrain } from "react-icons/fa";
import Breadcrumb from "@/components/common/Breadcrumb";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ReinforcementLearningPage = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <BaseLayout>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Learn", href: "" },
            { label: "Reinforcement Learning", href: "" },
          ]}
          className="mt-16 mb-3"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-[#83AFC9] mb-2 mt-4">
                Reinforcement Learning
              </h1>
              <p className="text-gray-600">
                Explore and visualize how agents learn to make decisions through interaction with their environment.
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <FiTarget className="h-3 w-3" />
                  <span>Interactive</span>
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <FaBrain className="h-3 w-3" />
                  <span>AI/ML</span>
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <FiCode className="h-3 w-3" />
                  <span>Algorithms</span>
                </Badge>
              </div>
            </div>
            <div className="hidden md:block">
              <motion.div
                className="p-2 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg shadow-lg w-20 h-20"
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-md h-full w-full flex items-center justify-center">
                  <FaBrain className="h-10 w-10 text-green-500" />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Simulation Card */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FiTarget className="h-5 w-5 text-green-500" />
                Interactive Simulation
              </CardTitle>
              <CardDescription>
                Observe how agents learn optimal policies through trial and error in different environments.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="aspect-video w-full rounded-md bg-gray-100 dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                <motion.div
                  className="relative w-16 h-16 bg-green-500 rounded-md"
                  animate={{
                    x: [-20, 20, -20],
                    y: [0, -20, 0],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <FaBrain className="h-6 w-6" />
                  </div>
                </motion.div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/simulations/reinforcement-learning/simulation" className="flex items-center justify-center gap-2">
                  <span>Launch Simulator</span>
                  <FiArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Comparison Card */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FiBarChart2 className="h-5 w-5 text-blue-500" />
                Algorithm Comparison
              </CardTitle>
              <CardDescription>
                Compare the performance, efficiency, and use cases of different reinforcement learning algorithms.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="aspect-video w-full rounded-md bg-gray-100 dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                <motion.div 
                  className="w-3/4 h-24 relative"
                  animate={{
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                >
                  <div className="absolute bottom-0 left-0 w-8 h-12 bg-blue-500 rounded-t-md"></div>
                  <div className="absolute bottom-0 left-12 w-8 h-16 bg-purple-500 rounded-t-md"></div>
                  <div className="absolute bottom-0 left-24 w-8 h-20 bg-green-500 rounded-t-md"></div>
                  <div className="absolute bottom-0 left-36 w-8 h-8 bg-red-500 rounded-t-md"></div>
                </motion.div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/simulations/reinforcement-learning/comparison" className="flex items-center justify-center gap-2">
                  <span>View Comparison</span>
                  <FiArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Info Card */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FiInfo className="h-5 w-5 text-purple-500" />
                Learning Resources
              </CardTitle>
              <CardDescription>
                Learn about the theory, applications, and implementation details of reinforcement learning.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="aspect-video w-full rounded-md bg-gray-100 dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                <motion.div
                  className="grid grid-cols-3 gap-2 w-3/4"
                  animate={{
                    y: [0, -5, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                >
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded col-span-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded col-span-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded col-span-2"></div>
                </motion.div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/simulations/reinforcement-learning/info" className="flex items-center justify-center gap-2">
                  <span>Explore Resources</span>
                  <FiArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Educational context at the bottom */}
        <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">
            Real-World Applications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2 text-green-600 dark:text-green-400">
                Game AI
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Reinforcement learning enables game characters to learn and adapt to player behavior, creating more challenging and dynamic gameplay experiences.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 text-green-600 dark:text-green-400">
                Robotics & Control
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Robots use reinforcement learning to master complex tasks like walking, grasping objects, or navigating unfamiliar environments through trial and error.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 text-green-600 dark:text-green-400">
                Resource Management
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                From optimizing data center cooling to managing electricity grids, RL helps systems learn efficient resource allocation strategies that adapt to changing conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default ReinforcementLearningPage;
