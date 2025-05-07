"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";

const PathfindingDemo = dynamic(() => import("./Pathfinding"), { ssr: false });

const simulations = [
  { key: "pathfinding", label: "Pathfinding", component: <PathfindingDemo /> },
];

const SimulationsHub: React.FC = () => {
  const [selected, setSelected] = useState(simulations[0].key);
  const currentSim = simulations.find((sim) => sim.key === selected);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-white to-blue-50 py-8">
      <h1 className="text-2xl font-bold mb-8">AI Interactive Playground</h1>
      <div className="flex gap-4 mb-8">
        {simulations.map((sim) => (
          <button
            key={sim.key}
            className={`px-4 py-2 rounded-lg border shadow-sm transition-colors duration-150 font-semibold ${selected === sim.key ? "bg-blue-200 border-blue-400" : "bg-white border-gray-200 hover:bg-blue-50"}`}
            onClick={() => setSelected(sim.key)}
          >
            {sim.label}
          </button>
        ))}
      </div>
      <div className="w-full flex justify-center">
        <div>{currentSim?.component}</div>
      </div>
    </div>
  );
};

export default SimulationsHub;
