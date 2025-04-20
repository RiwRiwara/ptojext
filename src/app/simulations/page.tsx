import React from "react";
import Link from "next/link";
import BaseLayout from "@/components/layout/BaseLayout";

const simulations = [
  {
    title: "Pathfinding in Maps",
    description: "Visualize how pathfinding algorithms work on a grid, like in Google Maps.",
    href: "/simulations/pathfinding"
  },
];

const SimulationsDashboard: React.FC = () => (
  <BaseLayout>
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Real-World Problem Simulations</h1>
      <div className="grid gap-4">
        {simulations.map(sim => (
          <Link key={sim.href} href={sim.href} className="block border rounded p-4 hover:bg-gray-50">
            <h2 className="text-lg font-semibold mb-1">{sim.title}</h2>
            <p className="text-gray-600">{sim.description}</p>
          </Link>
        ))}
      </div>
    </div>
  </BaseLayout>
);

export default SimulationsDashboard;
