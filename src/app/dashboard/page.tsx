"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import {
  Package,
  Download,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  ClipboardList,
  Clock,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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
  totalDownloads: number;
  status: "published" | "review" | "draft" | "approved" | "pending" | "rejected" | "suspended";
}

interface AdminApp {
  id: string;
  name: string;
  appId: string;
  status: string;
  developerName: string;
  developerEmail: string;
  createdAt: string;
}

interface AdminDeveloper {
  id: string;
  name: string;
  email: string;
  suspended: boolean;
  createdAt: string;
  appCount: number;
}

export default function DashboardPage() {
  const { user } = useAuth();

  if (user?.role === "admin") {
    return <AdminDashboard />;
  }
  return <DeveloperDashboard />;
}

// ---------------------------------------------------------------------------
// Admin Dashboard
// ---------------------------------------------------------------------------

function AdminDashboard() {
  const { data: allAppsData } = useQuery({
    queryKey: ["admin-all-apps-count"],
    queryFn: () => api.get<{ apps: AdminApp[]; total: number }>("/admin/apps"),
  });

  const { data: pendingAppsData } = useQuery({
    queryKey: ["admin-pending-apps"],
    queryFn: () =>
      api.get<{ apps: AdminApp[]; total: number }>(
        "/admin/apps?status=pending&limit=5",
      ),
  });

  const { data: developersData } = useQuery({
    queryKey: ["admin-developers-count"],
    queryFn: () =>
      api.get<{ developers: AdminDeveloper[]; total: number }>(
        "/admin/developers",
      ),
  });

  const { data: statsData } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => api.get<DashboardStats>("/dashboard/stats"),
  });

  const totalApps = allAppsData?.total ?? 0;
  const pendingCount = pendingAppsData?.total ?? 0;
  const totalDevs = developersData?.total ?? 0;
  const totalDownloads = statsData?.totalDownloads ?? 0;
  const pendingApps = pendingAppsData?.apps ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Platform-wide management</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-violet-50 text-violet-700 rounded-lg text-sm font-medium">
          <ShieldCheck className="h-4 w-4" />
          Admin
        </div>
      </div>

      {/* Admin Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Apps"
          value={totalApps}
          change={0}
          icon={Package}
        />
        <StatCard
          title="Total Developers"
          value={totalDevs}
          change={0}
          icon={Users}
        />
        <StatCard
          title="Pending Reviews"
          value={pendingCount}
          change={0}
          icon={ClipboardList}
          highlight={pendingCount > 0}
        />
        <StatCard
          title="Total Downloads"
          value={totalDownloads.toLocaleString()}
          change={0}
          icon={Download}
        />
      </div>

      {/* Pending Review Queue */}
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-warning-500" />
            <h2 className="font-semibold text-gray-900">Pending Reviews</h2>
          </div>
          <Link
            href="/dashboard/admin/apps?status=pending"
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            View all
          </Link>
        </div>
        <div className="divide-y">
          {pendingApps.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <CheckCircle className="h-10 w-10 mx-auto text-success-400 mb-2" />
              <p className="font-medium text-gray-700">All caught up!</p>
              <p className="text-sm">No apps awaiting review.</p>
            </div>
          ) : (
            pendingApps.map((app) => (
              <div key={app.id} className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {app.name}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {app.developerName} · {app.appId}
                  </div>
                </div>
                <Link
                  href={`/dashboard/admin/apps?highlight=${app.id}`}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium flex-shrink-0"
                >
                  Review →
                </Link>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Link
          href="/dashboard/admin/apps"
          className="card p-5 hover:shadow-md transition-shadow group"
        >
          <ClipboardList className="h-6 w-6 text-primary-500 mb-3" />
          <div className="font-semibold text-gray-900">All Apps</div>
          <div className="text-sm text-gray-500 mt-1">
            Review, approve, or reject submitted apps
          </div>
        </Link>
        <Link
          href="/dashboard/admin/developers"
          className="card p-5 hover:shadow-md transition-shadow group"
        >
          <Users className="h-6 w-6 text-primary-500 mb-3" />
          <div className="font-semibold text-gray-900">Developers</div>
          <div className="text-sm text-gray-500 mt-1">
            Manage accounts, view activity, suspend if needed
          </div>
        </Link>
        <Link
          href="/dashboard/admin/analytics"
          className="card p-5 hover:shadow-md transition-shadow group"
        >
          <TrendingUp className="h-6 w-6 text-primary-500 mb-3" />
          <div className="font-semibold text-gray-900">Analytics</div>
          <div className="text-sm text-gray-500 mt-1">
            Platform-wide download and usage trends
          </div>
        </Link>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Developer Dashboard
// ---------------------------------------------------------------------------

function DeveloperDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => api.get<DashboardStats>("/dashboard/stats"),
  });

  const { data: chartData } = useQuery({
    queryKey: ["dashboard-chart"],
    queryFn: () => api.get<ChartData[]>("/dashboard/chart"),
  });

  const { data: recentAppsResponse } = useQuery({
    queryKey: ["recent-apps"],
    queryFn: () =>
      api.get<{ apps: RecentApp[]; total: number }>("/apps?limit=5"),
  });

  const recentApps = recentAppsResponse?.apps;

  const EMPTY_STATS: DashboardStats = {
    totalApps: 0,
    totalDownloads: 0,
    activeUsers: 0,
    revenue: 0,
    changes: { apps: 0, downloads: 0, users: 0, revenue: 0 },
  };

  const displayStats = stats ?? EMPTY_STATS;
  const displayChart = chartData ?? [];

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
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    <linearGradient
                      id="colorDownloads"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
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
                      {(app.totalDownloads ?? 0).toLocaleString()} downloads
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
  highlight = false,
}: Readonly<{
  title: string;
  value: string | number;
  change: number;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
}>) {
  const isPositive = change >= 0;

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div
          className={`p-2 rounded-lg ${highlight ? "bg-warning-50" : "bg-primary-50"}`}
        >
          <Icon
            className={`h-5 w-5 ${highlight ? "text-warning-600" : "text-primary-600"}`}
          />
        </div>
        {change !== 0 && (
          <div
            className={`flex items-center text-sm ${
              isPositive ? "text-success-600" : "text-error-600"
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

function StatusBadge({ status }: Readonly<{ status: string }>) {
  const styles: Record<string, string> = {
    published: "badge-success",
    review: "badge-warning",
    draft: "badge-info",
  };

  const labels: Record<string, string> = {
    published: "Published",
    review: "In Review",
    draft: "Draft",
  };

  return <span className={styles[status] || "badge"}>{labels[status]}</span>;
}
