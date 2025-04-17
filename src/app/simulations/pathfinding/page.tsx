import React from "react";
import PathfindingDemo from "@/components/simulations/PathfindingDemo";
import BaseLayout from "@/components/layout/BaseLayout";

const PathfindingPage: React.FC = () => (
  <BaseLayout>
    <div className="max-w-2xl mx-auto p-4">
      <PathfindingDemo />
    </div>
  </BaseLayout>
);

export default PathfindingPage;
