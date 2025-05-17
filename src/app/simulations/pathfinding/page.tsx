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
import { PathfindingVisualizer } from "@/components/simulations/pathfinding/PathfindingVisualizer";
import { AlgorithmComparison } from "@/components/simulations/pathfinding/AlgorithmComparison";
import { AlgorithmInfo } from "@/components/simulations/pathfinding/AlgorithmInfo";
import {
  FiMap,
  FiBarChart2,
  FiInfo,
  FiCode,
  FiTarget,
  FiCompass,
} from "react-icons/fi";
import Breadcrumb from "@/components/common/Breadcrumb";

const PathfindingPage = () => {
  const [activeTab, setActiveTab] = useState("visualizer");
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
            { label: "Pathfinding Algorithms", href: "" },
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
                Pathfinding Algorithms
              </h1>
              <p className="text-gray-600">
                Explore and visualize algorithms used in navigation, game
                development, and robotics.
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <FiTarget className="h-3 w-3" />
                  <span>Interactive</span>
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <FiCompass className="h-3 w-3" />
                  <span>Navigation</span>
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
                  <FiMap className="h-10 w-10 text-blue-500" />
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
              <FiMap className="h-4 w-4" />
              <span>Interactive Visualizer</span>
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-2">
              <FiBarChart2 className="h-4 w-4" />
              <span>Algorithm Comparison</span>
            </TabsTrigger>
            <TabsTrigger value="info" className="flex items-center gap-2">
              <FiInfo className="h-4 w-4" />
              <span>Algorithm Information</span>
            </TabsTrigger>
          </TabsList>

          <Card className="border-t-4 border-t-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {activeTab === "visualizer" && (
                  <>
                    <FiMap className="h-5 w-5 text-blue-500" />
                    Interactive Pathfinding Visualizer
                  </>
                )}
                {activeTab === "comparison" && (
                  <>
                    <FiBarChart2 className="h-5 w-5 text-blue-500" />
                    Algorithm Performance Comparison
                  </>
                )}
                {activeTab === "info" && (
                  <>
                    <FiInfo className="h-5 w-5 text-blue-500" />
                    Pathfinding Algorithms Explained
                  </>
                )}
              </CardTitle>
              <CardDescription>
                {activeTab === "visualizer" &&
                  "Create obstacles, set start and end points, and watch algorithms find the path in real-time."}
                {activeTab === "comparison" &&
                  "Compare the performance, efficiency, and use cases of different pathfinding algorithms."}
                {activeTab === "info" &&
                  "Learn about the theory, applications, and implementation details of popular pathfinding algorithms."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TabsContent value="visualizer" className="mt-0">
                <PathfindingVisualizer />
              </TabsContent>
              <TabsContent value="comparison" className="mt-0">
                <AlgorithmComparison />
              </TabsContent>
              <TabsContent value="info" className="mt-0">
                <AlgorithmInfo />
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
                <h3 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-400">
                  Navigation Systems
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  GPS navigation devices use pathfinding algorithms like A* to
                  find the shortest or fastest route between two locations. They
                  consider factors like distance, traffic, and road conditions.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-400">
                  Game Development
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Video games use pathfinding to determine how characters move
                  through the game world, avoiding obstacles and finding optimal
                  paths to targets. This creates more intelligent and realistic
                  AI behavior.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-400">
                  Robotics
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Robots and autonomous vehicles rely on pathfinding to navigate
                  through physical spaces, plan routes, and avoid collisions.
                  These algorithms are essential for warehouse robots,
                  self-driving cars, and drones.
                </p>
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </BaseLayout>
  );
};

export default PathfindingPage;
