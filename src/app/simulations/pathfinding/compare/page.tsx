"use client";

import { PathfindingComparison } from '@/components/simulations/pathfinding/PathfindingComparison';
import { PageHeader } from '@/components/page_components/PageHeader';

export default function AlgorithmComparisonPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Pathfinding Algorithm Comparison" 
        description="Compare different pathfinding algorithms side by side and analyze their performance differences."
      />
      <PathfindingComparison />
    </div>
  );
}
