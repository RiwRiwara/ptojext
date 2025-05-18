"use client";

import { useState, useEffect } from 'react';
import BaseLayout from '@/components/layout/BaseLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LinearTimelineVisualization } from '@/components/simulations/linear-structures/LinearTimelineVisualization';
import { TrainTracksVisualization } from '@/components/simulations/linear-structures/TrainTracksVisualization';
import { DominoEffectVisualization } from '@/components/simulations/linear-structures/DominoEffectVisualization';
import { StackOfCardsVisualization } from '@/components/simulations/linear-structures/StackOfCardsVisualization';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import Breadcrumb from "@/components/common/Breadcrumb";
import BottomComponent from '@/components/page_components/landing_page/BottomComponent';

const LinearStructuresSimulation = () => {
  const [activeTab, setActiveTab] = useState("timeline");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="h-screen w-full flex items-center justify-center">Loading...</div>;
  }

  return (
    <BaseLayout>
      <main className="container mx-auto px-4 py-8">
        <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Learn", href: "" },
              { label: "Linear Data Structure", href: "" }
            ]}
            className="mt-16"
          />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mt-8 mb-8 ml-1 md:ml-0">
            <h1 className="text-4xl font-bold text-[#83AFC9] mb-2 mt-4">
              Linear Data Structures Visualization
            </h1>
            <p className="text-gray-600">
              Explore different visualizations of linear data structures and algorithms where elements are arranged in a straight, sequential order.
            </p>
          </div>
        </motion.div>

        <Tabs defaultValue="timeline" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="timeline">Timeline/Flowchart</TabsTrigger>
            <TabsTrigger value="train">Train Tracks</TabsTrigger>
            <TabsTrigger value="domino">Domino Effect</TabsTrigger>
            <TabsTrigger value="stack">Stack of Cards</TabsTrigger>
          </TabsList>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {activeTab === "timeline" && "Timeline/Flowchart Visualization"}
                {activeTab === "train" && "Train Tracks Visualization"}
                {activeTab === "domino" && "Domino Effect Visualization"}
                {activeTab === "stack" && "Stack of Cards Visualization"}
              </CardTitle>
              <CardDescription>
                {activeTab === "timeline" && "A sequential representation of elements in a horizontal line, ideal for visualizing arrays and linked lists."}
                {activeTab === "train" && "Data represented as connected train cars, emphasizing the one-directional flow of information."}
                {activeTab === "domino" && "Demonstrates sequential processing where each action triggers the next in a linear fashion."}
                {activeTab === "stack" && "A vertical stack structure showing LIFO (Last In, First Out) operations common in stack data structures."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TabsContent value="timeline" className="mt-0 p-2">
                <LinearTimelineVisualization />
              </TabsContent>

              <TabsContent value="train" className="mt-0 p-2">
                <TrainTracksVisualization />
              </TabsContent>

              <TabsContent value="domino" className="mt-0  p-2">
                <DominoEffectVisualization />
              </TabsContent>

              <TabsContent value="stack" className="mt-0 p-2">
                <StackOfCardsVisualization />
              </TabsContent>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About Linear Data Structures</CardTitle>
              <CardDescription>Key concepts and applications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">What are Linear Data Structures?</h3>
                <p className="text-gray-700">
                  Linear data structures organize elements in a sequential manner where each element has a
                  unique predecessor and successor (except the first and last elements). Common examples include
                  arrays, linked lists, stacks, and queues.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Key Characteristics</h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  <li>Elements are arranged in a sequential order</li>
                  <li>Data is processed in a linear fashion (one after another)</li>
                  <li>Simple to implement and understand</li>
                  <li>Memory utilization is predictable</li>
                  <li>Traversal is straightforward (forward or backward)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Real-world Applications</h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  <li>Music playlists (songs arranged sequentially)</li>
                  <li>Browser history (visited pages in order)</li>
                  <li>Task scheduling (operations in sequence)</li>
                  <li>Undo/Redo functionality in applications</li>
                  <li>Call stacks in programming languages</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </Tabs>
      </main>
      <BottomComponent/>
    </BaseLayout>
  );
};

export default LinearStructuresSimulation;
