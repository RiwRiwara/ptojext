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
import { ReinforcementLearningComparison } from "@/components/simulations/reinforcement-learning/ReinforcementLearningComparison";
import {
  FiBarChart2,
  FiCode,
  FiTarget,
} from "react-icons/fi";
import { FaBrain } from "react-icons/fa";
import Breadcrumb from "@/components/common/Breadcrumb";

const ReinforcementLearningComparisonPage = () => {
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
            { label: "Comparison", href: "" },
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
                Algorithm Comparison
              </h1>
              <p className="text-gray-600">
                Compare the performance, efficiency, and use cases of different reinforcement learning algorithms.
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <FiBarChart2 className="h-3 w-3" />
                  <span>Comparison</span>
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
                className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg w-20 h-20"
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
                  <FiBarChart2 className="h-10 w-10 text-blue-500" />
                </div>
              </motion.div>
            </div>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FiBarChart2 className="h-5 w-5 text-blue-500" />
                Algorithm Performance Comparison
              </CardTitle>
              <CardDescription>
                Compare the performance, efficiency, and use cases of different reinforcement learning algorithms.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReinforcementLearningComparison />
            </CardContent>
          </Card>

          {/* Additional educational content */}
          <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Choosing the Right Algorithm</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              When selecting a reinforcement learning algorithm for your task, consider these factors:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-400">
                  Sample Efficiency
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  How quickly does the algorithm learn from a limited number of environment interactions? This is crucial when training in real-world settings where data collection is expensive.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-400">
                  Stability & Convergence
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Does the algorithm reliably converge to a good policy? Some algorithms may be faster but less stable, while others trade speed for reliability.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-400">
                  Problem Complexity
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Simpler algorithms like Q-learning work well for discrete, small state spaces, while more complex problems with continuous actions may require policy gradient or actor-critic methods.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </BaseLayout>
  );
};

export default ReinforcementLearningComparisonPage;
