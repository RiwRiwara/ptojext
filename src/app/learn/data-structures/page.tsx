"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BaseLayout from "@/components/layout/BaseLayout";
import { LinearStructuresInfo } from "@/components/learn/data-structures/LinearStructuresInfo";
import { NonLinearStructuresInfo } from "@/components/learn/data-structures/NonLinearStructuresInfo";
import { DataStructureVisualizer } from "@/components/learn/data-structures/DataStructureVisualizer";
import { QuizSection } from "@/components/learn/data-structures/QuizSection";
import {
  FiBook,
  FiCheckCircle,
  FiList,
  FiGrid,
  FiActivity,
  FiHelpCircle,
} from "react-icons/fi";
import Breadcrumb from "@/components/common/Breadcrumb";

const DataStructuresPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [activeStructureType, setActiveStructureType] = useState("linear");
  const [isClient, setIsClient] = useState(false);
  const overviewRef = useRef<HTMLDivElement>(null);
  const visualizerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!isClient) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <BaseLayout>
      <main className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Learn", href: "" },
            { label: "Data Structure", href: "" },
          ]}
          className="mt-16"
        />

        <div className="mt-8 mb-8 ml-1 md:ml-0">
          <h1 className="text-4xl font-bold text-[#83AFC9] mb-2 mt-4">
            Data Structures
          </h1>
          <p className="text-gray-600">
            Explore and understand the fundamentals of data structures - the
            building blocks that organize and store data in computer memory.
            Learn how different structures optimize for different operations and
            use cases.
          </p>
        </div>

        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm py-2 border-b mb-6">
          <Tabs
            defaultValue="overview"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid grid-cols-4">
              <TabsTrigger
                value="overview"
                className="flex items-center gap-2 rounded-md"
              >
                <FiBook className="h-4 w-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger
                value="types"
                className="flex items-center gap-2 rounded-md"
              >
                <FiList className="h-4 w-4" />
                <span>Types</span>
              </TabsTrigger>
              <TabsTrigger
                value="visualizer"
                className="flex items-center gap-2 rounded-md"
              >
                <FiActivity className="h-4 w-4" />
                <span>Visualizer</span>
              </TabsTrigger>
              <TabsTrigger
                value="quiz"
                className="flex items-center gap-2 rounded-md"
              >
                <FiHelpCircle className="h-4 w-4" />
                <span>Quiz</span>
              </TabsTrigger>
            </TabsList>

            <div className="space-y-8 mt-6">
              <TabsContent value="overview" ref={overviewRef}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Understanding Data Structures</CardTitle>
                      <CardDescription>
                        The foundation of efficient algorithms and programming
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p>
                        Data structures are specialized formats for organizing,
                        processing, retrieving, and storing data. They provide a
                        means to manage large amounts of data efficiently for
                        various uses.
                      </p>

                      <div className="space-y-2 mt-4">
                        <h3 className="font-semibold">
                          Why Data Structures Matter
                        </h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700">
                          <li>
                            They determine the way data is organized in memory
                          </li>
                          <li>
                            They impact algorithm efficiency and performance
                          </li>
                          <li>
                            Different structures optimize for different
                            operations (insertion, deletion, search)
                          </li>
                          <li>
                            The right structure can dramatically improve
                            application performance
                          </li>
                        </ul>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                          <h3 className="font-semibold flex items-center gap-2 text-blue-700">
                            <FiList /> Linear Data Structures
                          </h3>
                          <p className="text-sm mt-2 text-gray-700">
                            Elements arranged sequentially, with each element
                            having at most two neighbors.
                          </p>
                          <Button
                            variant="link"
                            onClick={() => {
                              setActiveTab("types");
                              setActiveStructureType("linear");
                            }}
                            className="p-0 mt-2 text-blue-600 h-auto"
                          >
                            Learn more →
                          </Button>
                        </div>

                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                          <h3 className="font-semibold flex items-center gap-2 text-purple-700">
                            <FiGrid /> Non-Linear Data Structures
                          </h3>
                          <p className="text-sm mt-2 text-gray-700">
                            Elements arranged hierarchically or in a network,
                            with elements having multiple connections.
                          </p>
                          <Button
                            variant="link"
                            onClick={() => {
                              setActiveTab("types");
                              setActiveStructureType("nonlinear");
                            }}
                            className="p-0 mt-2 text-purple-600 h-auto"
                          >
                            Learn more →
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Learning Path</CardTitle>
                      <CardDescription>
                        Follow this path to master data structures
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-green-100 rounded-full p-1 mt-0.5">
                            <FiCheckCircle className="text-green-600 h-4 w-4" />
                          </div>
                          <div>
                            <h3 className="font-medium text-sm">
                              Start with Overview
                            </h3>
                            <p className="text-xs text-gray-500">
                              Understand the basics of data structures
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="bg-green-100 rounded-full p-1 mt-0.5">
                            <FiCheckCircle className="text-green-600 h-4 w-4" />
                          </div>
                          <div>
                            <h3 className="font-medium text-sm">
                              Explore Linear Structures
                            </h3>
                            <p className="text-xs text-gray-500">
                              Arrays, lists, stacks, queues, and more
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="bg-green-100 rounded-full p-1 mt-0.5">
                            <FiCheckCircle className="text-green-600 h-4 w-4" />
                          </div>
                          <div>
                            <h3 className="font-medium text-sm">
                              Dive into Non-Linear Structures
                            </h3>
                            <p className="text-xs text-gray-500">
                              Trees, graphs, heaps, and more
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="bg-green-100 rounded-full p-1 mt-0.5">
                            <FiCheckCircle className="text-green-600 h-4 w-4" />
                          </div>
                          <div>
                            <h3 className="font-medium text-sm">
                              Test Your Knowledge
                            </h3>
                            <p className="text-xs text-gray-500">
                              Quiz yourself on key concepts
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="bg-green-100 rounded-full p-1 mt-0.5">
                            <FiCheckCircle className="text-green-600 h-4 w-4" />
                          </div>
                          <div>
                            <h3 className="font-medium text-sm">
                              Try the Interactive Visualizer
                            </h3>
                            <p className="text-xs text-gray-500">
                              See data structures in action
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <Button
                          onClick={() => {
                            setActiveTab("visualizer");
                            setTimeout(
                              () => scrollToSection(visualizerRef),
                              100
                            );
                          }}
                          className="w-full"
                        >
                          Go to Interactive Visualizer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Choosing the Right Data Structure</CardTitle>
                    <CardDescription>
                      Compare common operations across different data structures
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Data Structure
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Access
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Search
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Insertion
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Deletion
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Use When
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Array
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              O(1)
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              O(n)
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              O(n)
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              O(n)
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              You need fast access by index
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Linked List
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              O(n)
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              O(n)
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              O(1)
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              O(1)
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              You need efficient insertions/deletions
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Hash Table
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              N/A
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              O(1) avg
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              O(1) avg
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              O(1) avg
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              You need fast lookup by key
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Binary Tree
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              O(log n)
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              O(log n)
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              O(log n)
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              O(log n)
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              You need hierarchical relationships
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Graph
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              O(1)
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              O(V+E)
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              O(1)
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              O(V+E)
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              You need to represent complex relationships
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="types">
                <Tabs
                  defaultValue={activeStructureType}
                  value={activeStructureType}
                  onValueChange={setActiveStructureType}
                >
                  <TabsList className="mb-6 w-full">
                    <TabsTrigger value="linear" className="flex-1">
                      Linear Data Structures
                    </TabsTrigger>
                    <TabsTrigger value="nonlinear" className="flex-1">
                      Non-Linear Data Structures
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="linear">
                    <LinearStructuresInfo />
                  </TabsContent>

                  <TabsContent value="nonlinear">
                    <NonLinearStructuresInfo />
                  </TabsContent>
                </Tabs>
              </TabsContent>

              <TabsContent value="visualizer" ref={visualizerRef}>
                <DataStructureVisualizer />
              </TabsContent>

              <TabsContent value="quiz">
                <QuizSection />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
    </BaseLayout>
  );
};

export default DataStructuresPage;
