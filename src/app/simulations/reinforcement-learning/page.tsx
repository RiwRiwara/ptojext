"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import BaseLayout from "@/components/layout/BaseLayout";
import { ReinforcementLearningVisualizer } from "@/components/simulations/reinforcement-learning/ReinforcementLearningVisualizer";
import { ReinforcementLearningComparison } from "@/components/simulations/reinforcement-learning/ReinforcementLearningComparison";
import { ReinforcementLearningInfo } from "@/components/simulations/reinforcement-learning/ReinforcementLearningInfo";
import { MatterJSRLEnvironment } from "@/components/simulations/reinforcement-learning/environments/MatterJSRLEnvironment";
import {
  FiBarChart2,
  FiInfo,
  FiCode,
  FiTarget,
  FiRefreshCw,
  FiSettings,
  FiPlay,
  FiPause,
} from "react-icons/fi";
import { FaBrain } from "react-icons/fa";
import Breadcrumb from "@/components/common/Breadcrumb";

const ReinforcementLearningPage = () => {
  const [activeTab, setActiveTab] = useState("visualizer");
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

        <Separator className="my-6" />

        <Tabs
          defaultValue="visualizer"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-1 md:grid-cols-3 mb-8">
            <TabsTrigger value="visualizer" className="flex items-center gap-2">
              <FaBrain className="h-4 w-4" />
              <span>Interactive Simulator</span>
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-2">
              <FiBarChart2 className="h-4 w-4" />
              <span>Algorithm Comparison</span>
            </TabsTrigger>
            <TabsTrigger value="info" className="flex items-center gap-2">
              <FiInfo className="h-4 w-4" />
              <span>Learning Concepts</span>
            </TabsTrigger>
          </TabsList>

          <Card className="border-t-4 border-t-green-500" >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {activeTab === "visualizer" && (
                  <>
                    <FaBrain className="h-5 w-5 text-green-500" />
                    Interactive Reinforcement Learning Simulator
                  </>
                )}
                {activeTab === "comparison" && (
                  <>
                    <FiBarChart2 className="h-5 w-5 text-green-500" />
                    Algorithm Performance Comparison
                  </>
                )}
                {activeTab === "info" && (
                  <>
                    <FiInfo className="h-5 w-5 text-green-500" />
                    Reinforcement Learning Explained
                  </>
                )}
              </CardTitle>
              <CardDescription>
                {activeTab === "visualizer" &&
                  "Observe how agents learn optimal policies through trial and error in different environments."}
                {activeTab === "comparison" &&
                  "Compare the performance, efficiency, and use cases of different reinforcement learning algorithms."}
                {activeTab === "info" &&
                  "Learn about the theory, applications, and implementation details of reinforcement learning."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TabsContent value="visualizer" className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
     

                  {/* Visualization Area - Takes 9/12 of the space on large screens */}
                  <div className="lg:col-span-9">
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
              </TabsContent>
              <TabsContent value="comparison" className="mt-0">
                <ReinforcementLearningComparison />
              </TabsContent>
              <TabsContent value="info" className="mt-0">
                <ReinforcementLearningInfo />
              </TabsContent>
            </CardContent>
          </Card>

          {/* Educational context at the bottom */}
          <div className="mt-12 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
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
        </Tabs>
      </div>
    </BaseLayout>
  );
};

export default ReinforcementLearningPage;
