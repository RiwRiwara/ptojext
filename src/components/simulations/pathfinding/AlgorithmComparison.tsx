"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Chart data
const algorithms = ["Dijkstra's", "A*", "BFS", "DFS", "Greedy Best-First"];

const chartData = {
  labels: algorithms,
  datasets: [
    {
      label: 'Execution Time (ms)',
      data: [120, 100, 150, 180, 90],
      backgroundColor: 'rgba(136, 132, 216, 0.8)',
      borderColor: 'rgba(136, 132, 216, 1)',
      borderWidth: 1,
    },
    {
      label: 'Memory Usage (MB)',
      data: [80, 90, 70, 50, 85],
      backgroundColor: 'rgba(130, 202, 157, 0.8)',
      borderColor: 'rgba(130, 202, 157, 1)',
      borderWidth: 1,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false,
    },
  },
};

export const AlgorithmComparison = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[300px]">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Comparison Table</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-2">Algorithm</th>
                <th className="p-2">Time Complexity</th>
                <th className="p-2">Space Complexity</th>
                <th className="p-2">Use Case</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2">Dijkstra s</td>
                <td className="p-2">O(V²) or O(E log V)</td>
                <td className="p-2">O(V)</td>
                <td className="p-2">Weighted graphs, shortest path</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">A*</td>
                <td className="p-2">O(E log V)</td>
                <td className="p-2">O(V)</td>
                <td className="p-2">Heuristic-based pathfinding</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">BFS</td>
                <td className="p-2">O(V + E)</td>
                <td className="p-2">O(V)</td>
                <td className="p-2">Unweighted graphs</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">DFS</td>
                <td className="p-2">O(V + E)</td>
                <td className="p-2">O(V)</td>
                <td className="p-2">Maze generation, topological sorting</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">Greedy Best-First</td>
                <td className="p-2">O(E log V)</td>
                <td className="p-2">O(V)</td>
                <td className="p-2">Fast approximate pathfinding</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};