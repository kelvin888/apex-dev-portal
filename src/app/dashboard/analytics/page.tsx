'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Download, Users, TrendingUp, Clock, BarChart2 } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type Period = '7d' | '30d' | '90d';

interface ChartData { date: string; downloads: number; users: number; }
interface DashboardStats {
  totalDownloads: number;
  activeUsers: number;
  changes: { downloads: number; users: number; };
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>('30d');

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.get<DashboardStats>('/dashboard/stats'),
  });

  const { data: chartData } = useQuery({
    queryKey: ['dashboard-chart'],
    queryFn: () => api.get<ChartData[]>('/dashboard/chart'),
  });

  const downloads = chartData ?? [];
  const totalDownloads = stats?.totalDownloads ?? 0;
  const activeUsers = stats?.activeUsers ?? 0;
  const downloadChange = stats?.changes.downloads ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          {(['7d', '30d', '90d'] as Period[]).map((p) => {
            const PERIOD_LABELS: Record<Period, string> = { '7d': '7 Days', '30d': '30 Days', '90d': '90 Days' };
            return (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  period === p
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {PERIOD_LABELS[p]}
              </button>
            );
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Download}
          title="Total Downloads"
          value={totalDownloads.toLocaleString()}
          change={downloadChange}
        />
        <StatCard
          icon={Users}
          title="Active Users"
          value={activeUsers.toLocaleString()}
          change={0}
        />
        <StatCard
          icon={TrendingUp}
          title="Avg. Session"
          value="—"
          noChange
        />
        <StatCard
          icon={Clock}
          title="Retention"
          value="—"
          noChange
        />
      </div>

      {/* Downloads Trend */}
      <div className="card">
        <div className="card-header">
          <h2 className="font-semibold">Downloads Trend</h2>
        </div>
        <div className="card-body">
          {downloads.length === 0 ? (
            <EmptyChart message="Downloads will appear here once users install your apps." />
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={downloads}>
                  <defs>
                    <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1890ff" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#1890ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="downloads"
                    stroke="#1890ff"
                    strokeWidth={2}
                    fill="url(#colorDownloads)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Sections not yet tracked by the server */}
      <div className="grid lg:grid-cols-3 gap-6">
        <ComingSoonCard
          title="Downloads by App"
          description="Per-app breakdown will appear here once your apps have downloads."
        />
        <ComingSoonCard
          title="Platform Split"
          description="iOS vs Android breakdown coming soon."
        />
        <ComingSoonCard
          title="Top Regions"
          description="Geographic data coming soon."
        />
      </div>

      <ComingSoonCard
        title="User Retention"
        description="Cohort retention analysis coming soon."
      />
    </div>
  );
}

function StatCard({
  icon: Icon,
  title,
  value,
  change,
  noChange,
}: Readonly<{
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  change?: number;
  noChange?: boolean;
}>) {
  const isPositive = (change ?? 0) >= 0;

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div className="p-2 bg-primary-50 rounded-lg">
          <Icon className="h-5 w-5 text-primary-600" />
        </div>
        {!noChange && change !== undefined && change !== 0 && (
          <span className={`text-sm ${isPositive ? 'text-success-600' : 'text-error-600'}`}>
            {isPositive ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-500">{title}</div>
      </div>
      {!noChange && <div className="text-xs text-gray-400 mt-2">vs last 30 days</div>}
    </div>
  );
}

function EmptyChart({ message }: Readonly<{ message: string }>) {
  return (
    <div className="h-72 flex flex-col items-center justify-center text-center text-gray-400">
      <BarChart2 className="h-10 w-10 mb-3 text-gray-300" />
      <p className="text-sm max-w-xs">{message}</p>
    </div>
  );
}

function ComingSoonCard({ title, description }: Readonly<{ title: string; description: string }>) {
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="font-semibold">{title}</h2>
      </div>
      <div className="card-body">
        <div className="h-40 flex flex-col items-center justify-center text-center text-gray-400">
          <BarChart2 className="h-8 w-8 mb-2 text-gray-300" />
          <p className="text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
}
