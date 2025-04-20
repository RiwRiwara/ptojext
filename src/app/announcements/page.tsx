"use client";
import BaseLayout from "@/components/layout/BaseLayout";
import { useState } from "react";

export default function Announcements() {
  // Example announcement and pathnote state (could be fetched from API or file in future)
  const [announcements] = useState([
    {
      date: "2025-04-20",
      title: "🚀 New Pathfinding Features!",
      content: "Added Dijkstra and A* algorithms, improved agent animation, and introduced random wall generation.",
    },
    {
      date: "2025-04-18",
      title: "✨ UI/UX Polish",
      content: "Modernized the simulation UI and improved responsiveness for all devices.",
    },
    {
      date: "2025-04-15",
      title: "📝 Initial Release",
      content: "Launched the AI Interactive Playground with BFS and DFS pathfinding visualizations.",
    },
  ]);

  return (
    <BaseLayout>
      <div className="py-12 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-br from-white to-blue-50">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md border border-blue-100 p-6">
          <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">Announcements & Pathnotes</h1>
          <div className="space-y-6">
            {announcements.map((item, idx) => (
              <div key={idx} className="bg-blue-50 rounded-lg p-4 border border-blue-200 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-blue-600 font-semibold">{item.date}</span>
                  <span className="text-lg font-bold text-blue-900">{item.title}</span>
                </div>
                <div className="text-gray-700 text-base mt-1">{item.content}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
