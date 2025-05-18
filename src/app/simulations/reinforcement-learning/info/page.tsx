"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BaseLayout from "@/components/layout/BaseLayout";
import { ReinforcementLearningInfo } from "@/components/simulations/reinforcement-learning/ReinforcementLearningInfo";
import {
  FiInfo,
  FiCode,
  FiTarget,
} from "react-icons/fi";
import { FaBrain } from "react-icons/fa";
import Breadcrumb from "@/components/common/Breadcrumb";

const ReinforcementLearningInfoPage = () => {
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
            { label: "Reinforcement Learning", href: "/simulations/reinforcement-learning" },
            { label: "Information", href: "" },
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
                Reinforcement Learning Explained
              </h1>
              <p className="text-gray-600">
                Learn about the theory, applications, and implementation details of reinforcement learning.
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <FiInfo className="h-3 w-3" />
                  <span>Educational</span>
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
                className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-lg w-20 h-20"
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
                  <FiInfo className="h-10 w-10 text-purple-500" />
                </div>
              </motion.div>
            </div>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FiInfo className="h-5 w-5 text-purple-500" />
                Reinforcement Learning Explained
              </CardTitle>
              <CardDescription>
                Learn about the theory, applications, and implementation details of reinforcement learning.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReinforcementLearningInfo />
            </CardContent>
          </Card>

          {/* Real-world applications section */}
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
        </motion.div>
      </div>
    </BaseLayout>
  );
};

export default ReinforcementLearningInfoPage;
