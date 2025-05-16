"use client";
import React, { useState } from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import BottomComponent from "@/components/page_components/landing_page/BottomComponent";
import Breadcrumb from "@/components/common/Breadcrumb";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Tabs, Tab } from "@heroui/tabs";
import { Divider } from "@heroui/divider";
import { motion } from "framer-motion";
import { FiCode, FiImage, FiGrid, FiLayers, FiPlay, FiPlus, FiSave, FiSettings, FiShare2 } from "react-icons/fi";

const playgroundCategories = [
  {
    id: "image-processing",
    title: "Image Processing Pipeline (Beta)",
    description: "Play with image processing pipeline drag and drop",
    icon: <FiImage className="text-2xl text-primary" />,
    href: "/simulations/image-processing",
    comingSoon: false,
  },
  {
    id: "machine-learning",
    title: "Machine Learning",
    description: "Build and train machine learning models using visual programming",
    icon: <FiGrid className="text-2xl text-primary" />,
    href: "/playground/machine-learning",
    comingSoon: true,
  },
  {
    id: "visualization",
    title: "Data Visualization",
    description: "Create interactive visualizations for your data",
    icon: <FiLayers className="text-2xl text-primary" />,
    href: "/playground/visualization",
    comingSoon: true,
  },
];

export default function PlaygroundPage() {
  const [activeTab, setActiveTab] = useState("explore");

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Playground", href: "/playground" },
        ]}
      />

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 mb-8 ml-1 md:ml-0"
          >
            <h1 className="text-4xl font-bold text-primary mb-2 mt-4">
              Interactive Playground
            </h1>
            <p className="text-gray-600 max-w-3xl text-lg">
              Explore, experiment, and learn with our interactive tools. Build your own workflows, 
              visualize algorithms, and gain hands-on experience with various concepts.
            </p>
          </motion.div>

          <Tabs 
            aria-label="Playground Options"
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key as string)}
            color="primary"
            variant="underlined"
            classNames={{
              tab: "text-gray-600 hover:text-primary-500",
              tabList: "border-b border-gray-200",
              cursor: "bg-primary-300",
              base: "text-primary font-semibold"
            }}
            className="mb-8"
          >
            <Tab 
              key="explore" 
              title={
                <div className="flex items-center gap-2">
                  <FiGrid />
                  <span>Explore Playgrounds</span>
                </div>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {playgroundCategories.map((category) => (
                  <motion.div
                    key={category.id}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="h-full"
                  >
                    <Card className="h-full shadow-md hover:shadow-lg transition-shadow">
                      <CardHeader className="flex gap-3 pb-0 pt-5 px-5">
                        <div className="p-2 bg-primary-50 rounded-lg">
                          {category.icon}
                        </div>
                        <div className="flex flex-col">
                          <p className="text-lg font-semibold">{category.title}</p>
                          {category.comingSoon && (
                            <p className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full w-fit">
                              Coming Soon
                            </p>
                          )}
                        </div>
                      </CardHeader>
                      <CardBody className="py-3 px-5">
                        <p className="text-gray-600">{category.description}</p>
                      </CardBody>
                      <CardFooter className="px-5 pb-5">
                        <Button
                          color="primary"
                          variant={category.comingSoon ? "bordered" : "solid"}
                          onPress={() => {
                            if (!category.comingSoon) {
                              window.location.href = category.href;
                            }
                          }}
                          className="w-full"
                          startContent={category.comingSoon ? <FiSettings /> : <FiPlay />}
                          isDisabled={category.comingSoon}
                        >
                          {category.comingSoon ? "Coming Soon" : "Launch Playground"}
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}

                {/* Create Your Own Card */}
                <motion.div
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="h-full"
                >
                  <Card className="h-full border-2 border-dashed border-gray-300 bg-gray-50 hover:border-primary-300 transition-colors">
                    <CardBody className="flex flex-col items-center justify-center gap-4 py-10">
                      <div className="p-4 bg-primary-50 rounded-full">
                        <FiPlus className="text-3xl text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold">Create Custom Playground</p>
                        <p className="text-gray-600 mt-2">Build your own custom playground with our tools</p>
                      </div>
                      <Button
                        color="primary"
                        variant="bordered"
                        className="mt-4"
                        startContent={<FiCode />}
                        isDisabled
                      >
                        Coming Soon
                      </Button>
                    </CardBody>
                  </Card>
                </motion.div>
              </div>
            </Tab>
            <Tab 
              key="recent" 
              title={
                <div className="flex items-center gap-2">
                  <FiSave />
                  <span>Recent Projects</span>
                </div>
              }
            >
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="p-4 bg-gray-100 rounded-full mb-4">
                  <FiSave className="text-3xl text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700">No Recent Projects</h3>
                <p className="text-gray-500 mt-2 text-center max-w-md">
                  Your recently used playgrounds and saved projects will appear here
                </p>
                <Button
                  color="primary"
                  className="mt-6"
                  onPress={() => setActiveTab("explore")}
                  startContent={<FiGrid />}
                >
                  Explore Playgrounds
                </Button>
              </div>
            </Tab>
            <Tab 
              key="community" 
              title={
                <div className="flex items-center gap-2">
                  <FiShare2 />
                  <span>Community Showcase</span>
                </div>
              }
            >
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="p-4 bg-gray-100 rounded-full mb-4">
                  <FiShare2 className="text-3xl text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700">Community Showcase Coming Soon</h3>
                <p className="text-gray-500 mt-2 text-center max-w-md">
                  Soon you will be able to share your projects and explore what others have created
                </p>
                <Button
                  color="primary"
                  className="mt-6"
                  onPress={() => setActiveTab("explore")}
                  startContent={<FiGrid />}
                >
                  Explore Playgrounds
                </Button>
              </div>
            </Tab>
          </Tabs>
    </>
  );
}
