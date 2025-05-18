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
import BottomComponent from "@/components/page_components/landing_page/BottomComponent";
import { useTranslation } from "react-i18next";

const DataStructuresPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [activeStructureType, setActiveStructureType] = useState("linear");
  const [isClient, setIsClient] = useState(false);
  const overviewRef = useRef<HTMLDivElement>(null);
  const visualizerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation("dataStructurePageTranslations");

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
            {t("title")}
          </h1>
          <p className="text-gray-600">{t("subtitle")}</p>
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
                <span>{t("tabs.overview")}</span>
              </TabsTrigger>
              <TabsTrigger
                value="types"
                className="flex items-center gap-2 rounded-md"
              >
                <FiList className="h-4 w-4" />
                <span>{t("tabs.types")}</span>
              </TabsTrigger>
              <TabsTrigger
                value="visualizer"
                className="flex items-center gap-2 rounded-md"
              >
                <FiActivity className="h-4 w-4" />
                <span>{t("tabs.visualizer")}</span>
              </TabsTrigger>
              <TabsTrigger
                value="quiz"
                className="flex items-center gap-2 rounded-md"
              >
                <FiHelpCircle className="h-4 w-4" />
                <span>{t("tabs.quiz")}</span>
              </TabsTrigger>
            </TabsList>

            <div className="space-y-8 mt-6">
              <TabsContent value="overview" ref={overviewRef}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>{t("overview.heading")}</CardTitle>
                      <CardDescription>
                        {t("overview.description")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p>{t("overview.body")}</p>

                      <div className="space-y-2 mt-4">
                        <h3 className="font-semibold">
                          {t("overview.why_heading")}
                        </h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700">
                          {(
                            t("overview.why_points", {
                              returnObjects: true,
                            }) as string[]
                          ).map((point, idx) => (
                            <li key={idx}>{point}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                          <h3 className="font-semibold flex items-center gap-2 text-blue-700">
                            <FiList />
                            {t("overview.linear.title")}
                          </h3>
                          <p className="text-sm mt-2 text-gray-700">
                            {t("overview.linear.description")}
                          </p>
                          <Button
                            variant="link"
                            onClick={() => {
                              setActiveTab("types");
                              setActiveStructureType("linear");
                            }}
                            className="p-0 mt-2 text-blue-600 h-auto"
                          >
                            {t("overview.linear.learn_more")}
                          </Button>
                        </div>

                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                          <h3 className="font-semibold flex items-center gap-2 text-purple-700">
                            <FiGrid />
                            {t("overview.nonlinear.title")}
                          </h3>
                          <p className="text-sm mt-2 text-gray-700">
                            {t("overview.nonlinear.description")}
                          </p>
                          <Button
                            variant="link"
                            onClick={() => {
                              setActiveTab("types");
                              setActiveStructureType("nonlinear");
                            }}
                            className="p-0 mt-2 text-purple-600 h-auto"
                          >
                            {t("overview.nonlinear.learn_more")}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t("overview.learning_path.title")}</CardTitle>
                      <CardDescription>
                        {t("overview.learning_path.description")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {(
                          t("overview.learning_path.steps", {
                            returnObjects: true,
                          }) as { title: string; description: string }[]
                        ).map((step, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className="bg-green-100 rounded-full p-1 mt-0.5">
                              <FiCheckCircle className="text-green-600 h-4 w-4" />
                            </div>
                            <div>
                              <h3 className="font-medium text-sm">
                                {step.title}
                              </h3>
                              <p className="text-xs text-gray-500">
                                {step.description}
                              </p>
                            </div>
                          </div>
                        ))}
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
                          {t("overview.learning_path.button")}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>{t("overview.comparison.title")}</CardTitle>
                    <CardDescription>
                      {t("overview.comparison.description")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            {(
                              t("overview.comparison.headers", {
                                returnObjects: true,
                              }) as string[]
                            ).map((header, idx) => (
                              <th
                                key={idx}
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {(
                            t("overview.comparison.rows", {
                              returnObjects: true,
                            }) as {
                              structure: string;
                              access: string;
                              search: string;
                              insertion: string;
                              deletion: string;
                              use_when: string;
                            }[]
                          ).map((row, idx) => (
                            <tr key={idx}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {row.structure}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {row.access}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {row.search}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {row.insertion}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {row.deletion}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {row.use_when}
                              </td>
                            </tr>
                          ))}
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
                      {t("types.linear")}
                    </TabsTrigger>
                    <TabsTrigger value="nonlinear" className="flex-1">
                      {t("types.nonlinear")}
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
      <BottomComponent />
    </BaseLayout>
  );
};

export default DataStructuresPage;
