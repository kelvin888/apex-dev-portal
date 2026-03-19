"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Download, Users, TrendingUp, Package } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Period = "7d" | "30d" | "90d";

const PERIOD_LABELS: Record<Period, string> = {
  "7d": "7 Days",
  "30d": "30 Days",
  "90d": "90 Days",
};

interface ChartData {
  date: string;
  downloads: number;
  users: number;
}

interface PlatformStats {
  totalApps: number;
  totalDownloads: number;
  activeUsers: number;
  changes: {
    apps: number;
    downloads: number;
    users: number;
  };
}

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState<Period>("30d");

  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => api.get<PlatformStats>("/dashboard/stats"),
  });

  const { data: chartData } = useQuery({
    queryKey: ["dashboard-chart"],
    queryFn: () => api.get<ChartData[]>("/dashboard/chart"),
  });

  const { data: allAppsData } = useQuery({
    queryKey: ["admin-all-apps-count"],
    queryFn: () => api.get<{ apps: unknown[]; total: number }>("/admin/apps"),
  });

  const { data: developersData } = useQuery({
    queryKey: ["admin-developers-count"],
    queryFn: () =>
      api.get<{ developers: unknown[]; total: number }>("/admin/developers"),
  });

  const downloads = chartData ?? [];
  const totalDownloads = stats?.totalDownloads ?? 0;
  const totalApps = allAppsData?.total ?? 0;
  const totalDevs = developersData?.total ?? 0;
  const downloadChange = stats?.changes.downloads ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Platform Analytics
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Download and usage trends across all apps
          </p>
        </div>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          {(["7d", "30d", "90d"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                period === p
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="p-2 bg-primary-50 rounded-lg w-fit">
            <Download className="h-5 w-5 text-primary-600" />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-gray-900">
              {totalDownloads.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">Total Downloads</div>
          </div>
        </div>
        <div className="card p-5">
          <div className="p-2 bg-primary-50 rounded-lg w-fit">
            <Users className="h-5 w-5 text-primary-600" />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-gray-900">{totalDevs}</div>
            <div className="text-sm text-gray-500">Registered Developers</div>
          </div>
        </div>
        <div className="card p-5">
          <div className="p-2 bg-primary-50 rounded-lg w-fit">
            <Package className="h-5 w-5 text-primary-600" />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-gray-900">{totalApps}</div>
            <div className="text-sm text-gray-500">Total Apps</div>
          </div>
        </div>
        <div className="card p-5">
          <div className="p-2 bg-primary-50 rounded-lg w-fit">
            <TrendingUp className="h-5 w-5 text-primary-600" />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-gray-900">
              {downloadChange > 0 ? "+" : ""}
              {downloadChange}%
            </div>
            <div className="text-sm text-gray-500">Download Change (30d)</div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="card">
        <div className="card-header">
          <h2 className="font-semibold text-gray-900">Downloads Over Time</h2>
        </div>
        <div className="card-body">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={downloads}>
                <defs>
                  <linearGradient
                    id="adminColorDownloads"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#1890ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1890ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="adminColorUsers"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#52c41a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#52c41a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="downloads"
                  stroke="#1890ff"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#adminColorDownloads)"
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#52c41a"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#adminColorUsers)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
