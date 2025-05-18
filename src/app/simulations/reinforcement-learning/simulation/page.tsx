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
import { ReinforcementLearningVisualizer } from "@/components/simulations/reinforcement-learning/ReinforcementLearningVisualizer";
import { MatterJSRLEnvironment } from "@/components/simulations/reinforcement-learning/environments/MatterJSRLEnvironment";
import {
  FiCode,
  FiTarget,
  FiPlay,
  FiPause,
} from "react-icons/fi";
import { FaBrain } from "react-icons/fa";
import Breadcrumb from "@/components/common/Breadcrumb";

const ReinforcementLearningSimulation = () => {
  const [isClient, setIsClient] = useState(false);
  const [usePhysics, setUsePhysics] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentEnvironment, setCurrentEnvironment] = useState<"gridworld" | "cartpole">("gridworld");

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
            { label: "Simulation", href: "" },
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
                Reinforcement Learning Simulation
              </h1>
              <p className="text-gray-600">
                Observe how agents learn optimal policies through trial and error in different environments.
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

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FiTarget className="h-5 w-5 text-green-500" />
                Reinforcement Learning Visualizer
              </CardTitle>
              <CardDescription>
                Observe how agents learn optimal policies through trial and error in different environments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Visualization Area - Takes 9/12 of the space on large screens */}
                <div className="col-span-12">
                  {usePhysics ? (
                    <div className="relative aspect-video w-full border rounded-lg overflow-hidden shadow-sm bg-white dark:bg-gray-900">
                      <MatterJSRLEnvironment 
                        width={800}
                        height={600} 
                        isPlaying={isPlaying}
                        environmentType={currentEnvironment}
                      />
                    </div>
                  ) : (
                    <ReinforcementLearningVisualizer />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Educational context at the bottom */}
          <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4">How This Simulation Works</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              This visualization demonstrates key reinforcement learning concepts:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2 text-green-600 dark:text-green-400">
                  Agent-Environment Interaction
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Watch as the agent (represented by the dot) explores its environment, receives rewards, and learns to make better decisions over time.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-green-600 dark:text-green-400">
                  Value Function Learning
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  The colors in the grid represent the agent s learned value function - how desirable each state is. Brighter colors indicate higher expected rewards.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </BaseLayout>
  );
};

export default ReinforcementLearningSimulation;
