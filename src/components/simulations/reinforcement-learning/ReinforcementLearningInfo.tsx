"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FiBookOpen, FiCode, FiTarget, FiRefreshCw, FiCpu } from "react-icons/fi";
import { FaBrain, FaRobot, FaGamepad, FaChartLine } from "react-icons/fa";

export const ReinforcementLearningInfo = () => {
  const [activeTab, setActiveTab] = useState("concepts");

  return (
    <div className="space-y-6">
      <Tabs id="info-tabs" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-1 md:grid-cols-3 mb-4">
          <TabsTrigger value="concepts">Key Concepts</TabsTrigger>
          <TabsTrigger value="algorithms">Algorithms</TabsTrigger>
          <TabsTrigger value="applications">Real-World Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="concepts">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FiBookOpen className="h-5 w-5 text-green-500" />
                  Reinforcement Learning Fundamentals
                </CardTitle>
                <CardDescription>
                  Understanding the core principles of reinforcement learning
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Overview Section */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-green-600 dark:text-green-400">What is Reinforcement Learning?</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Reinforcement Learning (RL) is a type of machine learning where an agent learns to make decisions by taking actions in an environment to maximize a reward signal. Unlike supervised learning, RL doesn&apos;t require labeled training data; instead, it learns from experience through trial and error.
                  </p>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
                    <p className="text-sm font-medium">
                      The science of decision making and learning from interaction with an environment.
                    </p>
                  </div>
                </div>

                {/* Key Concepts Accordion */}
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>The Reinforcement Learning Framework</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <p>The RL problem is formulated as an interaction between an agent and an environment, typically modeled as a Markov Decision Process (MDP) with these key components:</p>
                      <ul className="list-disc pl-5 space-y-2">
                        <li><span className="font-semibold">Agent:</span> The learner or decision-maker that interacts with the environment.</li>
                        <li><span className="font-semibold">Environment:</span> Everything the agent interacts with, outside of the agent itself.</li>
                        <li><span className="font-semibold">State (S):</span> A representation of the current situation of the environment.</li>
                        <li><span className="font-semibold">Action (A):</span> Choices that the agent can make.</li>
                        <li><span className="font-semibold">Reward (R):</span> A feedback signal indicating how good or bad the action was.</li>
                        <li><span className="font-semibold">Policy (π):</span> The agents strategy or mapping from states to actions.</li>
                        <li><span className="font-semibold">Value Function:</span> Prediction of future rewards, used to evaluate how good a state or action is.</li>
                      </ul>
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md mt-2">
                        <p className="text-sm">
                          The agent-environment interaction cycle: The agent observes the current state, takes an action, receives a reward, and transitions to a new state. This cycle continues until the episode ends.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger>Exploration vs. Exploitation</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <p>One of the central challenges in reinforcement learning is balancing exploration and exploitation:</p>
                      <ul className="list-disc pl-5 space-y-2">
                        <li><span className="font-semibold">Exploration:</span> Trying new actions to discover better strategies and gather more information about the environment.</li>
                        <li><span className="font-semibold">Exploitation:</span> Using known information to maximize reward, choosing actions that are known to yield good results.</li>
                      </ul>
                      <p>Common strategies for balancing exploration and exploitation include:</p>
                      <ul className="list-disc pl-5 space-y-2">
                        <li><span className="font-semibold">ε-greedy:</span> Choose the best-known action with probability (1-ε) and a random action with probability ε.</li>
                        <li><span className="font-semibold">Softmax:</span> Choose actions with probability proportional to their estimated values.</li>
                        <li><span className="font-semibold">Upper Confidence Bound (UCB):</span> Balances exploration and exploitation by adding an exploration bonus to actions that havent been chosen often.</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger>Value Functions and Optimal Policies</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <p>Value functions are central to reinforcement learning and come in two main forms:</p>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>
                          <span className="font-semibold">State-Value Function (V(s)):</span> The expected return when starting in state s and following policy π.
                          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded mt-1 font-mono text-xs">V<sub>π</sub>(s) = E<sub>π</sub>[G<sub>t</sub> | S<sub>t</sub> = s]</div>
                        </li>
                        <li>
                          <span className="font-semibold">Action-Value Function (Q(s,a)):</span> The expected return when taking action a in state s and then following policy π.
                          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded mt-1 font-mono text-xs">Q<sub>π</sub>(s,a) = E<sub>π</sub>[G<sub>t</sub> | S<sub>t</sub> = s, A<sub>t</sub> = a]</div>
                        </li>
                      </ul>
                      <p>The goal in RL is to find the optimal policy π* that maximizes the expected return. This is achieved by finding the optimal value functions:</p>
                      <ul className="list-disc pl-5 space-y-2">
                        <li><span className="font-semibold">Optimal State-Value Function (V*):</span> The maximum value achievable for each state.</li>
                        <li><span className="font-semibold">Optimal Action-Value Function (Q*):</span> The maximum value achievable for each state-action pair.</li>
                      </ul>
                      <p>Once we have Q*, the optimal policy can be derived by simply selecting the action with the highest Q-value in each state.</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger>Markov Decision Processes (MDPs)</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <p>MDPs provide the mathematical framework for modeling decision-making problems in reinforcement learning. An MDP is defined by:</p>
                      <ul className="list-disc pl-5 space-y-2">
                        <li><span className="font-semibold">Set of states S:</span> All possible situations the agent might find itself in.</li>
                        <li><span className="font-semibold">Set of actions A:</span> All possible decisions the agent can make.</li>
                        <li><span className="font-semibold">Transition probability P(s&apos;|s,a):</span> The probability of transitioning to state when taking action a in state s.</li>
                        <li><span className="font-semibold">Reward function R(s,a,s&apos;):</span> The immediate reward received after transitioning from state s to s&apos; due to action a.</li>
                        <li><span className="font-semibold">Discount factor γ:</span> A value between 0 and 1 that determines the importance of future rewards.</li>
                      </ul>
                      <p>The Markov property is key to MDPs: the future depends only on the current state and action, not on the history of how we got there.</p>
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md mt-2">
                        <p className="text-sm">
                          Every reinforcement learning problem can be framed as an MDP, although in practice we may not know all the transition probabilities or reward functions explicitly.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="algorithms">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FiCode className="h-5 w-5 text-green-500" />
                  Reinforcement Learning Algorithms
                </CardTitle>
                <CardDescription>
                  Understanding the main approaches to solving reinforcement learning problems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Q-Learning Section */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-3">
                        <FiTarget className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">Q-Learning</h3>
                        <Badge variant="outline" className="mt-1">Value-based</Badge>
                        <Badge variant="outline" className="mt-1 ml-2">Off-policy</Badge>
                      </div>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300">
                      Q-Learning is a value-based reinforcement learning algorithm that learns the value of taking a specific action in a specific state. It&apos;s an off-policy algorithm, meaning it learns about the optimal policy regardless of the policy being followed.
                    </p>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Key Properties:</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Uses a Q-table to store state-action values</li>
                        <li>Learns the optimal policy even when following an exploratory policy</li>
                        <li>Update rule uses the maximum Q-value of the next state</li>
                        <li>Guaranteed to converge to optimal policy in tabular settings</li>
                      </ul>
                    </div>

                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                      <h4 className="font-mono text-sm font-semibold mb-2">Q-Learning Update Rule:</h4>
                      <p className="font-mono text-xs">
                        Q(s, a) ← Q(s, a) + α[r + γ max<sub>a&apos;</sub> Q(s&apos;, a&apos;) - Q(s, a)]
                      </p>
                      <ul className="text-xs mt-2 space-y-1">
                        <li>α: Learning rate</li>
                        <li>γ: Discount factor</li>
                        <li>r: Immediate reward</li>
                        <li>s, a: Current state and action</li>
                        <li>s&apos;, a&apos;: Next state and action</li>
                      </ul>
                    </div>
                  </div>

                  {/* SARSA Section */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full p-3">
                        <FiRefreshCw className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400">SARSA</h3>
                        <Badge variant="outline" className="mt-1">Value-based</Badge>
                        <Badge variant="outline" className="mt-1 ml-2">On-policy</Badge>
                      </div>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300">
                      SARSA (State-Action-Reward-State-Action) is an on-policy reinforcement learning algorithm. Unlike Q-learning, it updates its values based on the action actually taken in the next state, rather than the maximum possible reward.
                    </p>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Key Properties:</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Uses a Q-table like Q-learning</li>
                        <li>Updates based on the actual next action taken (following current policy)</li>
                        <li>More conservative/safer in environments with penalties</li>
                        <li>Better performance during training in some environments</li>
                      </ul>
                    </div>

                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                      <h4 className="font-mono text-sm font-semibold mb-2">SARSA Update Rule:</h4>
                      <p className="font-mono text-xs">
                        Q(s, a) ← Q(s, a) + α[r + γ Q(s&apos;, a&apos;) - Q(s, a)]
                      </p>
                      <ul className="text-xs mt-2 space-y-1">
                        <li>α: Learning rate</li>
                        <li>γ: Discount factor</li>
                        <li>r: Immediate reward</li>
                        <li>s, a: Current state and action</li>
                        <li>s&apos;, a&apos;: Next state and the action actually taken</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="applications">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FiTarget className="h-5 w-5 text-green-500" />
                  Real-World Applications
                </CardTitle>
                <CardDescription>
                  How reinforcement learning is transforming various industries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Robotics Application */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Robotics & Control</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="w-full h-40 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-md flex items-center justify-center">
                        <FaRobot className="h-16 w-16 text-blue-500" />
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Reinforcement learning enables robots to learn complex tasks like grasping objects, walking, and navigating environments through trial and error without explicit programming.
                      </p>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        <li>Robot manipulation and dexterity</li>
                        <li>Legged locomotion</li>
                        <li>Drone navigation</li>
                        <li>Autonomous vehicles</li>
                      </ul>
                      <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                        Boston Dynamics uses RL to train their robots for dynamic movements and recovery from falls.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Gaming & Simulation */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Gaming & Simulation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="w-full h-40 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-md flex items-center justify-center">
                        <FaGamepad className="h-16 w-16 text-purple-500" />
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        RL has transformed game AI, enabling agents to master complex games and create more engaging opponents that adapt to player behavior.
                      </p>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        <li>AlphaGo defeating world champions</li>
                        <li>Adaptive opponents in video games</li>
                        <li>Procedural content generation</li>
                        <li>Testing game balance</li>
                      </ul>
                      <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                        DeepMind&apos;s AlphaGo and AlphaZero mastered Go, Chess, and Shogi using RL approaches.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Resource Management */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Resource Management</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="w-full h-40 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-md flex items-center justify-center">
                        <FaChartLine className="h-16 w-16 text-green-500" />
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        RL excels at optimizing complex resource allocation problems in dynamic environments where traditional methods struggle.
                      </p>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        <li>Data center cooling optimization</li>
                        <li>Electricity grid management</li>
                        <li>Traffic light control</li>
                        <li>Supply chain optimization</li>
                      </ul>
                      <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                        Google reduced their data center cooling costs by 40% using deep reinforcement learning.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
