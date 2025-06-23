import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Legend, Tooltip);

interface Post {
  createdAt: number;
  likes?: number;
}
interface Comment {
  createdAt: number;
}

interface ActivityMetricsProps {
  posts: Post[];
  comments: Comment[];
}

export function ActivityMetrics({ posts = [], comments = [] }: ActivityMetricsProps) {
  const now = new Date();
  const months = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return d.toLocaleString("default", { month: "short" });
  });

  function monthRange(index: number) {
    const start = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1).getTime();
    const end = new Date(now.getFullYear(), now.getMonth() - (4 - index), 1).getTime();
    return { start, end };
  }

  const contributions = months.map((_, idx) => {
    const { start, end } = monthRange(idx);
    const postsCount = posts.filter((p) => p.createdAt >= start && p.createdAt < end).length;
    const commentsCount = comments.filter((c) => c.createdAt >= start && c.createdAt < end).length;
    return postsCount + commentsCount;
  });

  const interactions = months.map((_, idx) => {
    const { start, end } = monthRange(idx);
    return posts
      .filter((p) => p.createdAt >= start && p.createdAt < end)
      .reduce((sum, p) => sum + (p.likes || 0), 0);
  });

  const growth = contributions.map((_, idx) =>
    contributions.slice(0, idx + 1).reduce((a, b) => a + b, 0),
  );

  const data = {
    labels: months,
    datasets: [
      {
        label: "Kontribusi",
        data: contributions,
        borderColor: "#6366f1",
        backgroundColor: "rgba(99,102,241,0.3)",
      },
      {
        label: "Interaksi",
        data: interactions,
        borderColor: "#10b981",
        backgroundColor: "rgba(16,185,129,0.3)",
      },
      {
        label: "Pertumbuhan",
        data: growth,
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245,158,11,0.3)",
      },
    ],
  };

  const options = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "top" as const } } };

  const totalContrib = posts.length + comments.length;
  const totalInteractions = posts.reduce((sum, p) => sum + (p.likes || 0), 0);
  const totalGrowth = growth[growth.length - 1] || 0;

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-[#1D1D1F] mb-4">Activity Metrics</h2>
      <div className="neumorphic-card p-4 h-64">
        <Line data={data} options={options} />
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="neumorphic-card p-4 text-center">
          <div className="text-xl font-bold">{totalContrib}</div>
          <div className="text-sm text-[#718096]">Total Kontribusi</div>
        </div>
        <div className="neumorphic-card p-4 text-center">
          <div className="text-xl font-bold">{totalInteractions}</div>
          <div className="text-sm text-[#718096]">Total Interaksi</div>
        </div>
        <div className="neumorphic-card p-4 text-center">
          <div className="text-xl font-bold">{totalGrowth}</div>
          <div className="text-sm text-[#718096]">Total Pertumbuhan</div>
        </div>
      </div>
    </div>
  );
}

export default ActivityMetrics;
