"use client";

import { useState, useEffect } from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LinearTimelineVisualization } from "@/components/simulations/linear-structures/LinearTimelineVisualization";
import { TrainTracksVisualization } from "@/components/simulations/linear-structures/TrainTracksVisualization";
import { DominoEffectVisualization } from "@/components/simulations/linear-structures/DominoEffectVisualization";
import { StackOfCardsVisualization } from "@/components/simulations/linear-structures/StackOfCardsVisualization";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import Breadcrumb from "@/components/common/Breadcrumb";
import BottomComponent from "@/components/page_components/landing_page/BottomComponent";
import { useTranslation } from "react-i18next";
const LinearStructuresSimulation = () => {
  const [activeTab, setActiveTab] = useState("timeline");
  const [isClient, setIsClient] = useState(false);
  const { t } = useTranslation("linearDataStructurePageTranslations");
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
      <main className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Learn", href: "" },
            { label: "Linear Data Structure", href: "" },
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
              {t("title")}
            </h1>
            <p className="text-gray-600">{t("title-sub")}</p>
          </div>
        </motion.div>

        <Tabs
          defaultValue="timeline"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
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
                {activeTab === "timeline" && t("timeline-desc")}
                {activeTab === "train" && t("train-desc")}
                {activeTab === "domino" && t("domino-desc")}
                {activeTab === "stack" && t("stack-desc")}
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
              <CardTitle>{t("linear-card-title")}</CardTitle>
              <CardDescription>{t("linear-card-desc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">{t("linear-what-title")}</h3>
                <p className="text-gray-700">{t("linear-what-body")}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t("linear-key-title")}</h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  {(
                    t("linear-key-points", { returnObjects: true }) as string[]
                  ).map((point: string, idx: number) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t("linear-app-title")}</h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  {(
                    t("linear-app-points", { returnObjects: true }) as string[]
                  ).map((point: string, idx: number) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </Tabs>
      </main>
      <BottomComponent />
    </BaseLayout>
  );
};

export default LinearStructuresSimulation;
