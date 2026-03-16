'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import {
  Package,
  Download,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
} from 'lucide-react';
import Link from 'next/link';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DashboardStats {
  totalApps: number;
  totalDownloads: number;
  activeUsers: number;
  revenue: number;
  changes: {
    apps: number;
    downloads: number;
    users: number;
    revenue: number;
  };
}

interface ChartData {
  date: string;
  downloads: number;
  users: number;
}

interface RecentApp {
  id: string;
  name: string;
  appId: string;
  icon?: string;
  downloads: number;
  status: 'published' | 'review' | 'draft';
}

export default function DashboardPage() {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.get<DashboardStats>('/dashboard/stats'),
  });

  const { data: chartData } = useQuery({
    queryKey: ['dashboard-chart'],
    queryFn: () => api.get<ChartData[]>('/dashboard/chart'),
  });

  const { data: recentApps } = useQuery({
    queryKey: ['recent-apps'],
    queryFn: () => api.get<RecentApp[]>('/apps?limit=5'),
  });

  // Mock data for development
  const mockStats: DashboardStats = {
    totalApps: 3,
    totalDownloads: 12547,
    activeUsers: 3421,
    revenue: 4250,
    changes: {
      apps: 0,
      downloads: 12.5,
      users: 8.3,
      revenue: 15.2,
    },
  };

  const mockChartData: ChartData[] = [
    { date: 'Jan', downloads: 4000, users: 2400 },
    { date: 'Feb', downloads: 3000, users: 1398 },
    { date: 'Mar', downloads: 2000, users: 9800 },
    { date: 'Apr', downloads: 2780, users: 3908 },
    { date: 'May', downloads: 1890, users: 4800 },
    { date: 'Jun', downloads: 2390, users: 3800 },
    { date: 'Jul', downloads: 3490, users: 4300 },
  ];

  const displayStats = stats || mockStats;
  const displayChart = chartData || mockChartData;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link href="/dashboard/apps/new" className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          New App
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Apps"
          value={displayStats.totalApps}
          change={displayStats.changes.apps}
          icon={Package}
        />
        <StatCard
          title="Total Downloads"
          value={displayStats.totalDownloads.toLocaleString()}
          change={displayStats.changes.downloads}
          icon={Download}
        />
        <StatCard
          title="Active Users"
          value={displayStats.activeUsers.toLocaleString()}
          change={displayStats.changes.users}
          icon={Users}
        />
        <StatCard
          title="Revenue"
          value={`$${displayStats.revenue.toLocaleString()}`}
          change={displayStats.changes.revenue}
          icon={TrendingUp}
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <div className="card-header">
            <h2 className="font-semibold text-gray-900">Downloads & Users</h2>
          </div>
          <div className="card-body">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={displayChart}>
                  <defs>
                    <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1890ff" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#1890ff" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#52c41a" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#52c41a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                  />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="downloads"
                    stroke="#1890ff"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorDownloads)"
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#52c41a"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorUsers)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Apps */}
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Apps</h2>
            <Link
              href="/dashboard/apps"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              View all
            </Link>
          </div>
          <div className="divide-y">
            {(recentApps || []).length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Package className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                <p>No apps yet</p>
                <Link
                  href="/dashboard/apps/new"
                  className="text-sm text-primary-600 hover:underline"
                >
                  Create your first app
                </Link>
              </div>
            ) : (
              recentApps?.map((app) => (
                <Link
                  key={app.id}
                  href={`/dashboard/apps/${app.id}`}
                  className="flex items-center gap-3 p-4 hover:bg-gray-50"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {app.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {app.downloads.toLocaleString()} downloads
                    </div>
                  </div>
                  <StatusBadge status={app.status} />
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  change,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  change: number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const isPositive = change >= 0;

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div className="p-2 bg-primary-50 rounded-lg">
          <Icon className="h-5 w-5 text-primary-600" />
        </div>
        {change !== 0 && (
          <div
            className={`flex items-center text-sm ${
              isPositive ? 'text-success-600' : 'text-error-600'
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="h-4 w-4" />
            ) : (
              <ArrowDownRight className="h-4 w-4" />
            )}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div className="mt-4">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-500">{title}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    published: 'badge-success',
    review: 'badge-warning',
    draft: 'badge-info',
  };

  const labels: Record<string, string> = {
    published: 'Published',
    review: 'In Review',
    draft: 'Draft',
  };

  return <span className={styles[status] || 'badge'}>{labels[status]}</span>;
}
