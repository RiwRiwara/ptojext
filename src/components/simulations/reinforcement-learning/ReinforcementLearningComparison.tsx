"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip as ChartTooltip, 
  Legend as ChartLegend, 
  ChartData, 
  ChartOptions,
  BarController,
  LineController
} from "chart.js";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

// Register Chart.js components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement, 
  Title, 
  ChartTooltip, 
  ChartLegend,
  BarController,
  LineController
);

// Performance data for different algorithms across environments
const algorithmData = [
  {
    name: "Q-Learning",
    gridworld: 95,
    cartpole: 65,
    mountaincar: 70,
    convergenceSpeed: 80,
    memoryUsage: 30,
    computationalComplexity: 20,
  },
  {
    name: "SARSA",
    gridworld: 90,
    cartpole: 60,
    mountaincar: 65,
    convergenceSpeed: 75,
    memoryUsage: 30,
    computationalComplexity: 20,
  },
  {
    name: "DQN",
    gridworld: 85,
    cartpole: 95,
    mountaincar: 90,
    convergenceSpeed: 40,
    memoryUsage: 80,
    computationalComplexity: 75,
  },
];

// Learning curve data (episodes vs reward)
const learningCurveData = [
  { episode: 0, QLearning: -100, SARSA: -100, DQN: -100 },
  { episode: 20, QLearning: -80, SARSA: -85, DQN: -95 },
  { episode: 40, QLearning: -60, SARSA: -70, DQN: -90 },
  { episode: 60, QLearning: -40, SARSA: -50, DQN: -70 },
  { episode: 80, QLearning: -25, SARSA: -35, DQN: -40 },
  { episode: 100, QLearning: -15, SARSA: -25, DQN: -10 },
  { episode: 120, QLearning: -10, SARSA: -20, DQN: 0 },
  { episode: 140, QLearning: -8, SARSA: -15, DQN: 10 },
  { episode: 160, QLearning: -5, SARSA: -10, DQN: 15 },
  { episode: 180, QLearning: -3, SARSA: -8, DQN: 18 },
  { episode: 200, QLearning: -2, SARSA: -5, DQN: 20 },
];

// Algorithm characteristics for comparison
const algorithmCharacteristics = [
  { 
    name: "Q-Learning", 
    type: "Value-based, Off-policy",
    strengths: "Simple to implement, works well in deterministic environments",
    weaknesses: "Struggles with large state spaces, can be slow to converge in stochastic environments",
    bestFor: "Small, discrete state and action spaces with clear reward signals"
  },
  { 
    name: "SARSA", 
    type: "Value-based, On-policy",
    strengths: "More conservative exploration, safer in environments with penalties",
    weaknesses: "Generally slower convergence than Q-Learning, struggles with large state spaces",
    bestFor: "Environments where safety during learning is important"
  },
  { 
    name: "DQN", 
    type: "Value-based with Neural Networks, Off-policy",
    strengths: "Handles high-dimensional state spaces, can learn complex patterns",
    weaknesses: "More complex to implement, requires more computational resources, can be unstable",
    bestFor: "Complex environments with high-dimensional state spaces (e.g., image inputs)"
  },
];

export const ReinforcementLearningComparison = () => {
  const [activeTab, setActiveTab] = useState("performance");
  const [environmentFilter, setEnvironmentFilter] = useState("gridworld");
  
  const barChartRef = useRef<HTMLCanvasElement>(null);
  const resourceChartRef = useRef<HTMLCanvasElement>(null);
  const learningCurveChartRef = useRef<HTMLCanvasElement>(null);
  
  const environmentMetricMap: Record<string, string> = {
    gridworld: "gridworld",
    cartpole: "cartpole",
    mountaincar: "mountaincar",
  };

  // Prepare data for environment performance chart
  useEffect(() => {
    if (!barChartRef.current) return;
    
    const ctx = barChartRef.current.getContext('2d');
    if (!ctx) return;
    
    // Check if chart already exists and destroy it
    const chartInstance = ChartJS.getChart(barChartRef.current);
    if (chartInstance) {
      chartInstance.destroy();
    }
    
    const metric = environmentMetricMap[environmentFilter];
    const chartData = {
      labels: algorithmData.map(alg => alg.name),
      datasets: [
        {
          label: 'Success Rate %',
          data: algorithmData.map(alg => alg[metric as keyof typeof alg] as number),
          backgroundColor: '#3b82f6',
          borderColor: '#2563eb',
          borderWidth: 1
        }
      ]
    };
    
    const chartOptions: ChartOptions<'bar'> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: `Algorithm Performance in ${environmentFilter.charAt(0).toUpperCase() + environmentFilter.slice(1)} Environment`
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.parsed.y}%`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: 'Success Rate (%)'
          }
        }
      }
    };
    
    new ChartJS(ctx, {
      type: 'bar',
      data: chartData,
      options: chartOptions
    });
  }, [environmentFilter, environmentMetricMap]);
  
  // Resource usage chart
  useEffect(() => {
    if (!resourceChartRef.current) return;
    
    const ctx = resourceChartRef.current.getContext('2d');
    if (!ctx) return;
    
    // Check if chart already exists and destroy it
    const chartInstance = ChartJS.getChart(resourceChartRef.current);
    if (chartInstance) {
      chartInstance.destroy();
    }
    
    const chartData = {
      labels: algorithmData.map(alg => alg.name),
      datasets: [
        {
          label: 'Convergence Speed',
          data: algorithmData.map(alg => alg.convergenceSpeed),
          backgroundColor: '#10b981',
          borderColor: '#059669',
          borderWidth: 1
        },
        {
          label: 'Memory Usage',
          data: algorithmData.map(alg => alg.memoryUsage),
          backgroundColor: '#f59e0b',
          borderColor: '#d97706',
          borderWidth: 1
        },
        {
          label: 'Computational Complexity',
          data: algorithmData.map(alg => alg.computationalComplexity),
          backgroundColor: '#ef4444',
          borderColor: '#dc2626',
          borderWidth: 1
        }
      ]
    };
    
    const chartOptions: ChartOptions<'bar'> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Resource Usage Comparison'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: 'Value (higher = more usage)'
          }
        }
      }
    };
    
    new ChartJS(ctx, {
      type: 'bar',
      data: chartData,
      options: chartOptions
    });
  }, []);
  
  // Learning curve chart
  useEffect(() => {
    if (!learningCurveChartRef.current) return;
    
    const ctx = learningCurveChartRef.current.getContext('2d');
    if (!ctx) return;
    
    // Check if chart already exists and destroy it
    const chartInstance = ChartJS.getChart(learningCurveChartRef.current);
    if (chartInstance) {
      chartInstance.destroy();
    }
    
    const chartData = {
      labels: learningCurveData.map(point => point.episode),
      datasets: [
        {
          label: 'Q-Learning',
          data: learningCurveData.map(point => point.QLearning),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.3,
          fill: false
        },
        {
          label: 'SARSA',
          data: learningCurveData.map(point => point.SARSA),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.3,
          fill: false
        },
        {
          label: 'DQN',
          data: learningCurveData.map(point => point.DQN),
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.3,
          fill: false
        }
      ]
    };
    
    const chartOptions: ChartOptions<'line'> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Learning Curves'
        }
      },
      scales: {
        y: {
          min: -100,
          max: 25,
          title: {
            display: true,
            text: 'Average Reward'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Training Episodes'
          }
        }
      }
    };
    
    new ChartJS(ctx, {
      type: 'line',
      data: chartData,
      options: chartOptions
    });
  }, []);

  return (
    <div className="space-y-6">
      <Tabs id="comparison-tabs" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-1 md:grid-cols-3 mb-4">
          <TabsTrigger value="performance">Performance Comparison</TabsTrigger>
          <TabsTrigger value="learningCurves">Learning Curves</TabsTrigger>
          <TabsTrigger value="characteristics">Algorithm Characteristics</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Algorithm Performance by Environment</CardTitle>
              <CardDescription>
                Comparing how well each algorithm performs in different reinforcement learning environments
              </CardDescription>
              <div className="flex flex-wrap gap-2 mt-2">
                <Button
                  variant={environmentFilter === "gridworld" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEnvironmentFilter("gridworld")}
                >
                  Grid World
                </Button>
                <Button
                  variant={environmentFilter === "cartpole" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEnvironmentFilter("cartpole")}
                >
                  Cart Pole
                </Button>
                <Button
                  variant={environmentFilter === "mountaincar" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEnvironmentFilter("mountaincar")}
                >
                  Mountain Car
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <motion.div
                key={environmentFilter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="h-80"
              >
                <canvas ref={barChartRef} />
              </motion.div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <h4 className="font-semibold mb-2">Key Insights</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Q-Learning performs best in simple, discrete environments like Grid World</li>
                  <li>DQN excels in environments with continuous state spaces like Cart Pole</li>
                  <li>All algorithms can solve the problems given enough training time, but with different efficiency</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resource Usage Comparison</CardTitle>
              <CardDescription>
                Comparing computational requirements and efficiency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <canvas ref={resourceChartRef} />
              </div>

              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
                <h4 className="font-semibold mb-2">Resource Implications</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Tabular methods (Q-Learning, SARSA) have faster convergence in simple environments</li>
                  <li>DQN requires more computing resources but handles complex environments better</li>
                  <li>Consider your computational constraints when selecting an algorithm</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learningCurves">
          <Card>
            <CardHeader>
              <CardTitle>Learning Curves</CardTitle>
              <CardDescription>
                How reward accumulates over training episodes for each algorithm
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <canvas ref={learningCurveChartRef} />
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <h4 className="font-semibold mb-2">Learning Pattern Analysis</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>DQN starts slower but eventually outperforms other algorithms</li>
                  <li>Q-Learning shows faster initial improvement in many environments</li>
                  <li>SARSA typically has more consistent, gradual improvement</li>
                  <li>The learning curves demonstrate the exploration-exploitation tradeoff</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="characteristics">
          <Card>
            <CardHeader>
              <CardTitle>Algorithm Characteristics</CardTitle>
              <CardDescription>
                Detailed comparison of theoretical properties and use cases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>Comparison of reinforcement learning algorithm characteristics</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Algorithm</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Strengths</TableHead>
                    <TableHead>Weaknesses</TableHead>
                    <TableHead>Best Use Cases</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {algorithmCharacteristics.map((alg) => (
                    <TableRow key={alg.name}>
                      <TableCell className="font-medium">{alg.name}</TableCell>
                      <TableCell>{alg.type}</TableCell>
                      <TableCell>{alg.strengths}</TableCell>
                      <TableCell>{alg.weaknesses}</TableCell>
                      <TableCell>{alg.bestFor}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6">
                <h4 className="font-semibold mb-3">Key Differences</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-md bg-gray-50 dark:bg-gray-800">
                    <h5 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">
                      On-policy vs. Off-policy
                    </h5>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      SARSA (on-policy) learns from actions actually taken, making it more conservative.
                      Q-Learning and DQN (off-policy) learn from the optimal action regardless of the action taken,
                      often leading to faster convergence but potentially riskier exploration.
                    </p>
                  </div>
                  <div className="p-4 rounded-md bg-gray-50 dark:bg-gray-800">
                    <h5 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">
                      Tabular vs. Function Approximation
                    </h5>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Q-Learning and SARSA use tables to store values for each state-action pair,
                      making them suitable only for small, discrete state spaces.
                      DQN uses neural networks to approximate the Q-function, allowing it to handle
                      large or continuous state spaces.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};