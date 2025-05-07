"use client";
import React from "react";

// Import the main Pathfinding component from the pathfinding directory
import PathfindingComponent from "./pathfinding/Pathfinding";

/**
 * Pathfinding Component
 * 
 * This component has been refactored for improved maintainability.
 * The implementation is now divided into modular components in the 'pathfinding' directory:
 * 
 * - algorithms.ts: Contains all pathfinding algorithm implementations
 * - types.ts: Contains shared types and constants
 * - Cell.tsx: Renders individual cells in the grid
 * - GridComponent.tsx: Renders the complete grid with physics
 * - ControlPanel.tsx: Contains UI controls for the simulation
 * - AlgorithmInfo.tsx: Displays information about the algorithms
 * 
 * This approach allows for better code organization and easier maintenance.
 */
const Pathfinding: React.FC = () => {
  return (
    <PathfindingComponent />
  );
};

export default Pathfinding;
