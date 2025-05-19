"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FiPlay, FiPause, FiRefreshCw, FiSettings, FiList, FiZap } from "react-icons/fi";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useInView } from "react-intersection-observer";
import { useRLEnvironment } from "./hooks/useRLEnvironment";
import { RLEnvironmentType, RLAlgorithm } from "./types/reinforcement-learning-types";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { ThreeJSCartPoleRenderer } from "./environments/ThreeJSCartPoleRenderer";
import { AnimatedGridWorldRenderer } from "./environments/AnimatedGridWorldRenderer";
import { MatterJSRLEnvironment } from "./environments/MatterJSRLEnvironment";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export const ReinforcementLearningVisualizer = () => {
  const [ref, inView] = useInView({ triggerOnce: true });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [environmentType, setEnvironmentType] = useState<RLEnvironmentType>("gridworld");
  const [algorithm, setAlgorithm] = useState<RLAlgorithm>("qlearning");
  const [showValues, setShowValues] = useState(true);
  const [episodeCount, setEpisodeCount] = useState(0);
  const [totalReward, setTotalReward] = useState(0);
  const [explorationRate, setExplorationRate] = useState(0.2);
  const [learningRate, setLearningRate] = useState(0.1);
  const [discountFactor, setDiscountFactor] = useState(0.9);
  const [showSettings, setShowSettings] = useState(false);
  const [visualizationType, setVisualizationType] = useState<"2d" | "3d">("2d");
  const [showLogs, setShowLogs] = useState(false);
  const [actionLogs, setActionLogs] = useState<Array<{
    episode: number;
    step: number;
    state: string;
    action: number;
    reward: number;
    nextState: string;
    qValue: number;
    timestamp: number;
  }>>([]);
  
  // Cartpole state for 3D visualization
  const [cartPoleState, setCartPoleState] = useState({
    position: 0,
    angle: 0,
    velocity: 0,
    angularVelocity: 0
  });

  const { 
    environment, 
    resetEnvironment,
    stepEnvironment,
    toggleTraining,
    setAlgorithmParams,
  } = useRLEnvironment(environmentType, algorithm, canvasRef);

  useEffect(() => {
    if (inView && canvasRef.current) {
      resetEnvironment();
    }
  }, [inView, environmentType, algorithm, resetEnvironment]);

  useEffect(() => {
    if (!isPlaying) return;

    const intervalId = setInterval(() => {
      const result = stepEnvironment();
      if (result) {
        setEpisodeCount(result.episode);
        setTotalReward(result.totalReward);
      }
    }, 500 / speed);

    return () => clearInterval(intervalId);
  }, [isPlaying, speed, stepEnvironment]);

  useEffect(() => {
    setAlgorithmParams({
      learningRate,
      explorationRate,
      discountFactor
    });
  }, [learningRate, explorationRate, discountFactor, setAlgorithmParams]);

  const handlePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  const handleReset = () => {
    setIsPlaying(false);
    resetEnvironment();
    setEpisodeCount(0);
    setTotalReward(0);
  };

  const handleSpeedChange = (values: number[]) => {
    setSpeed(values[0]);
  };

  const handleEnvironmentChange = (value: string) => {
    setIsPlaying(false);
    setEnvironmentType(value as RLEnvironmentType);
  };

  const handleAlgorithmChange = (value: string) => {
    setIsPlaying(false);
    setAlgorithm(value as RLAlgorithm);
  };

  return (
    <div ref={ref} className="flex flex-col">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 lg:w-2/3">
          <Card className="bg-white dark:bg-gray-800 shadow-sm">
            <CardContent className="p-4">
              <div className="relative">
                <canvas 
                  ref={canvasRef} 
                  className="w-full h-[400px] lg:h-[500px] border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900"
                ></canvas>
                
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-md shadow-md">
                    <div className="font-semibold text-sm">Episode: {episodeCount}</div>
                    <div className="font-semibold text-sm">Reward: {totalReward.toFixed(2)}</div>
                  </div>
                </div>
                
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="default" 
                      onClick={handlePlayPause}
                      className="flex items-center gap-1"
                    >
                      {isPlaying ? <FiPause className="h-4 w-4" /> : <FiPlay className="h-4 w-4" />}
                      {isPlaying ? "Pause" : "Play"}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleReset}
                      className="flex items-center gap-1"
                    >
                      <FiRefreshCw className="h-4 w-4" />
                      Reset
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Speed:</span>
                    <Slider
                      value={[speed]}
                      min={0.5}
                      max={5}
                      step={0.5}
                      onValueChange={handleSpeedChange}
                      className="w-32"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:w-1/3">
          <Card className="bg-white dark:bg-gray-800 shadow-sm h-full overflow-hidden border border-gray-200 dark:border-gray-700">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-750 p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold text-blue-700 dark:text-blue-400 flex items-center gap-2">
                  <FiZap className="h-5 w-5 text-amber-500" />
                  Simulation Controls
                </CardTitle>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  <FiSettings className="h-4 w-4" />
                  <span className="text-sm">{showSettings ? "Hide" : "Show"} Advanced</span>
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-5">
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="environment" className="text-sm font-medium flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                      Environment
                    </Label>
                    <Select onValueChange={handleEnvironmentChange} value={environmentType}>
                      <SelectTrigger className="bg-white dark:bg-gray-850 border-gray-200 dark:border-gray-700 h-10 transition-all hover:border-blue-400 dark:hover:border-blue-500">
                        <SelectValue placeholder="Select environment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="gridworld" className="hover:bg-blue-50 dark:hover:bg-gray-700">Grid World</SelectItem>
                          <SelectItem value="cartpole" className="hover:bg-blue-50 dark:hover:bg-gray-700">Cart Pole</SelectItem>
                          <SelectItem value="mountaincar" className="hover:bg-blue-50 dark:hover:bg-gray-700">Mountain Car</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="algorithm" className="text-sm font-medium flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
                      Algorithm
                    </Label>
                    <Select onValueChange={handleAlgorithmChange} value={algorithm}>
                      <SelectTrigger className="bg-white dark:bg-gray-850 border-gray-200 dark:border-gray-700 h-10 transition-all hover:border-indigo-400 dark:hover:border-indigo-500">
                        <SelectValue placeholder="Select algorithm" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="qlearning" className="hover:bg-blue-50 dark:hover:bg-gray-700">Q-Learning</SelectItem>
                          <SelectItem value="sarsa" className="hover:bg-blue-50 dark:hover:bg-gray-700">SARSA</SelectItem>
                          <SelectItem value="dqn" className="hover:bg-blue-50 dark:hover:bg-gray-700">Deep Q-Network</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-gray-750 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch 
                      id="show-values" 
                      checked={showValues} 
                      onCheckedChange={setShowValues}
                      className="data-[state=checked]:bg-blue-600" 
                    />
                    <Label htmlFor="show-values" className="text-sm font-medium cursor-pointer">
                      Show Q-Values
                    </Label>
                  </div>
                  
                  <Badge variant="outline" className="bg-white dark:bg-gray-800">
                    {showValues ? "Visible" : "Hidden"}
                  </Badge>
                </div>
                
                <AnimatePresence>
                  {showSettings && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-5 overflow-hidden"
                    >
                      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent my-2" />
                      
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-750 rounded-xl p-4 border border-blue-100 dark:border-gray-700 shadow-sm">
                        <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-3">Algorithm Parameters</h4>
                        
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <Label htmlFor="exploration" className="text-sm font-medium">Exploration Rate (ε)</Label>
                              <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                                {explorationRate.toFixed(2)}
                              </Badge>
                            </div>
                            <Slider
                              id="exploration"
                              value={[explorationRate]}
                              min={0}
                              max={1}
                              step={0.05}
                              onValueChange={(values) => setExplorationRate(values[0])}
                              className="slider-blue"
                            />
                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                              <span>Exploit (0)</span>
                              <span>Explore (1)</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <Label htmlFor="learning" className="text-sm font-medium">Learning Rate (α)</Label>
                              <Badge variant="secondary" className="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                                {learningRate.toFixed(2)}
                              </Badge>
                            </div>
                            <Slider
                              id="learning"
                              value={[learningRate]}
                              min={0.01}
                              max={1}
                              step={0.01}
                              onValueChange={(values) => setLearningRate(values[0])}
                              className="slider-indigo"
                            />
                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                              <span>Slow (0.01)</span>
                              <span>Fast (1)</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <Label htmlFor="discount" className="text-sm font-medium">Discount Factor (γ)</Label>
                              <Badge variant="secondary" className="bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300">
                                {discountFactor.toFixed(2)}
                              </Badge>
                            </div>
                            <Slider
                              id="discount"
                              value={[discountFactor]}
                              min={0}
                              max={0.99}
                              step={0.01}
                              onValueChange={(values) => setDiscountFactor(values[0])}
                              className="slider-violet"
                            />
                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                              <span>Immediate (0)</span>
                              <span>Future (0.99)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card className="mt-6 bg-white dark:bg-gray-800 shadow-sm">
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-3">Current Simulation: {algorithm === "qlearning" ? "Q-Learning" : algorithm === "sarsa" ? "SARSA" : "Deep Q-Network"} in {environmentType === "gridworld" ? "Grid World" : environmentType === "cartpole" ? "Cart Pole" : "Mountain Car"}</h3>
          
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            {environmentType === "gridworld" && "In the Grid World environment, an agent must navigate from a start position to a goal while avoiding obstacles. The agent receives a small negative reward for each step, a large negative reward for hitting obstacles, and a large positive reward for reaching the goal."}
            {environmentType === "cartpole" && "In the Cart Pole environment, a pole is attached to a cart moving along a frictionless track. The goal is to balance the pole by applying forces to the cart. The episode ends when the pole falls past a certain angle or the cart moves out of bounds."}
            {environmentType === "mountaincar" && "In the Mountain Car environment, a car is positioned in a valley between two mountains. The goal is to drive up the mountain on the right, but the car's engine is not strong enough to scale the mountain in a single pass. The agent must learn to build momentum by moving back and forth."}
          </p>
          
          <p className="text-gray-700 dark:text-gray-300">
            {algorithm === "qlearning" && "Q-Learning is an off-policy RL algorithm that learns the value of taking a specific action in a specific state. It updates its Q-values using the maximum future reward, regardless of the policy being followed."}
            {algorithm === "sarsa" && "SARSA (State-Action-Reward-State-Action) is an on-policy RL algorithm that updates its Q-values based on the action actually taken in the next state, rather than the maximum possible reward."}
            {algorithm === "dqn" && "Deep Q-Network (DQN) combines Q-Learning with deep neural networks to handle high-dimensional state spaces. It uses techniques like experience replay and target networks to stabilize learning."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
