import React from "react";
import { Pathfinding } from "@/components/simulations";
import BaseLayout from "@/components/layout/BaseLayout";

const PathfindingPage: React.FC = () => (
  <BaseLayout>
    <div className="max-w-6xl mx-auto p-4">
      <Pathfinding />
    </div>
  </BaseLayout>
);

export default PathfindingPage;
