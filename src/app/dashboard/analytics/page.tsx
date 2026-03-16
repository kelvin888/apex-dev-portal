'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import {
  Download,
  Users,
  TrendingUp,
  Globe,
  Smartphone,
  Clock,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

type Period = '7d' | '30d' | '90d';

const COLORS = ['#1890ff', '#52c41a', '#faad14', '#ff4d4f', '#722ed1'];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>('30d');

  // Mock data for development
  const downloadsTrend = [
    { date: 'Mar 1', downloads: 245 },
    { date: 'Mar 5', downloads: 312 },
    { date: 'Mar 10', downloads: 289 },
    { date: 'Mar 15', downloads: 401 },
    { date: 'Mar 20', downloads: 356 },
    { date: 'Mar 25', downloads: 423 },
    { date: 'Mar 30', downloads: 487 },
  ];

  const usersTrend = [
    { date: 'Mar 1', active: 1245, new: 89 },
    { date: 'Mar 5', active: 1312, new: 102 },
    { date: 'Mar 10', active: 1289, new: 78 },
    { date: 'Mar 15', active: 1401, new: 115 },
    { date: 'Mar 20', active: 1356, new: 92 },
    { date: 'Mar 25', active: 1423, new: 128 },
    { date: 'Mar 30', active: 1487, new: 134 },
  ];

  const appBreakdown = [
    { name: 'QuickShop', downloads: 2341 },
    { name: 'FoodExpress', downloads: 1890 },
    { name: 'Budget Tracker', downloads: 1201 },
  ];

  const platformData = [
    { name: 'iOS', value: 45 },
    { name: 'Android', value: 55 },
  ];

  const regionData = [
    { name: 'Nigeria', value: 35 },
    { name: 'Kenya', value: 25 },
    { name: 'South Africa', value: 20 },
    { name: 'Ghana', value: 12 },
    { name: 'Other', value: 8 },
  ];

  const retentionData = [
    { day: 'Day 1', retention: 100 },
    { day: 'Day 3', retention: 72 },
    { day: 'Day 7', retention: 58 },
    { day: 'Day 14', retention: 45 },
    { day: 'Day 30', retention: 32 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          {(['7d', '30d', '90d'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                period === p
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Download}
          title="Total Downloads"
          value="12,547"
          change={12.5}
          period={period}
        />
        <StatCard
          icon={Users}
          title="Active Users"
          value="3,421"
          change={8.3}
          period={period}
        />
        <StatCard
          icon={TrendingUp}
          title="Avg. Session"
          value="4m 32s"
          change={5.2}
          period={period}
        />
        <StatCard
          icon={Clock}
          title="Retention"
          value="32%"
          change={-2.1}
          period={period}
        />
      </div>

      {/* Downloads & Users Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h2 className="font-semibold">Downloads Trend</h2>
          </div>
          <div className="card-body">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={downloadsTrend}>
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
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="font-semibold">Active & New Users</h2>
          </div>
          <div className="card-body">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={usersTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="active"
                    name="Active Users"
                    stroke="#1890ff"
                    fill="#1890ff"
                    fillOpacity={0.3}
                  />
                  <Area
                    type="monotone"
                    dataKey="new"
                    name="New Users"
                    stroke="#52c41a"
                    fill="#52c41a"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* App Breakdown & Demographics */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-header">
            <h2 className="font-semibold">Downloads by App</h2>
          </div>
          <div className="card-body">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={appBreakdown} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={100} />
                  <Tooltip />
                  <Bar dataKey="downloads" fill="#1890ff" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-gray-500" />
            <h2 className="font-semibold">Platform</h2>
          </div>
          <div className="card-body">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {platformData.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header flex items-center gap-2">
            <Globe className="h-5 w-5 text-gray-500" />
            <h2 className="font-semibold">Top Regions</h2>
          </div>
          <div className="card-body">
            <div className="space-y-3">
              {regionData.map((region, index) => (
                <div key={region.name} className="flex items-center gap-3">
                  <div className="text-sm text-gray-600 w-24">{region.name}</div>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${region.value}%`,
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    />
                  </div>
                  <div className="text-sm font-medium w-12 text-right">
                    {region.value}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Retention */}
      <div className="card">
        <div className="card-header">
          <h2 className="font-semibold">User Retention</h2>
          <p className="text-sm text-gray-500 mt-1">
            Percentage of users returning after their first visit
          </p>
        </div>
        <div className="card-body">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={retentionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} unit="%" />
                <Tooltip />
                <Bar dataKey="retention" fill="#52c41a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  title,
  value,
  change,
  period,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  change: number;
  period: Period;
}) {
  const isPositive = change >= 0;
  const periodLabel = period === '7d' ? 'week' : period === '30d' ? 'month' : '3 months';

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div className="p-2 bg-primary-50 rounded-lg">
          <Icon className="h-5 w-5 text-primary-600" />
        </div>
        <span
          className={`text-sm ${isPositive ? 'text-success-600' : 'text-error-600'}`}
        >
          {isPositive ? '+' : ''}
          {change}%
        </span>
      </div>
      <div className="mt-4">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-500">{title}</div>
      </div>
      <div className="text-xs text-gray-400 mt-2">vs last {periodLabel}</div>
    </div>
  );
}
