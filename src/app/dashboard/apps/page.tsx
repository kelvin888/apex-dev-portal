'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Link from 'next/link';
import {
  Plus,
  Search,
  Package,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  Download,
  ExternalLink,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface App {
  id: string;
  appId: string;
  name: string;
  description?: string;
  icon?: string;
  status: 'draft' | 'review' | 'published' | 'rejected';
  version: string;
  downloads: number;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export default function AppsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');

  const { data: appsResponse, isLoading } = useQuery({
    queryKey: ['apps', search, filter],
    queryFn: () =>
      api.get<{ apps: App[]; total: number }>(`/apps?search=${search}&status=${filter === 'all' ? '' : filter}`),
  });

  const apps = appsResponse?.apps;

  // Mock data for development
  const mockApps: App[] = [
    {
      id: '1',
      appId: 'com.example.shop',
      name: 'QuickShop',
      description: 'E-commerce mini-app for quick shopping',
      status: 'published',
      version: '1.2.3',
      downloads: 5432,
      rating: 4.5,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-03-10T14:30:00Z',
    },
    {
      id: '2',
      appId: 'com.example.food',
      name: 'FoodExpress',
      description: 'Food delivery and restaurant discovery',
      status: 'review',
      version: '2.0.0',
      downloads: 3210,
      rating: 4.2,
      createdAt: '2024-02-01T08:00:00Z',
      updatedAt: '2024-03-14T09:15:00Z',
    },
    {
      id: '3',
      appId: 'com.example.tracker',
      name: 'Budget Tracker',
      description: 'Personal finance and expense tracking',
      status: 'draft',
      version: '0.1.0',
      downloads: 0,
      createdAt: '2024-03-12T16:00:00Z',
      updatedAt: '2024-03-12T16:00:00Z',
    },
  ];

  const displayApps = apps || mockApps;

  const filteredApps = displayApps.filter((app) => {
    if (filter !== 'all' && app.status !== filter) return false;
    if (search && !app.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Apps</h1>
        <Link href="/dashboard/apps/new" className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          New App
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search apps..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'published', 'review', 'draft'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === status
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Apps List */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="card p-12 text-center">
          <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="font-medium text-gray-900 mb-1">No apps found</h3>
          <p className="text-gray-500 mb-4">
            {search
              ? 'Try a different search term'
              : "You haven't created any apps yet"}
          </p>
          <Link href="/dashboard/apps/new" className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First App
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  );
}

function AppCard({ app }: { app: App }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const statusColors: Record<string, string> = {
    published: 'badge-success',
    review: 'badge-warning',
    draft: 'badge-info',
    rejected: 'badge-error',
  };

  const statusLabels: Record<string, string> = {
    published: 'Published',
    review: 'In Review',
    draft: 'Draft',
    rejected: 'Rejected',
  };

  return (
    <div className="card p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
          {app.icon ? (
            <img
              src={app.icon}
              alt={app.name}
              className="w-full h-full rounded-xl object-cover"
            />
          ) : (
            <Package className="h-6 w-6 text-gray-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <Link
              href={`/dashboard/apps/${app.id}`}
              className="font-semibold text-gray-900 hover:text-primary-600 truncate"
            >
              {app.name}
            </Link>
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1 rounded-lg hover:bg-gray-100"
              >
                <MoreVertical className="h-4 w-4 text-gray-500" />
              </button>
              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border z-20">
                    <Link
                      href={`/dashboard/apps/${app.id}`}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Link>
                    <Link
                      href={`/dashboard/apps/${app.id}/edit`}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Link>
                    {app.status === 'published' && (
                      <a
                        href={`apex://${app.appId}`}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open in App
                      </a>
                    )}
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error-600 hover:bg-error-50">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="text-sm text-gray-500 truncate">{app.appId}</div>
        </div>
      </div>

      {app.description && (
        <p className="mt-3 text-sm text-gray-600 line-clamp-2">
          {app.description}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between">
        <span className={statusColors[app.status]}>
          {statusLabels[app.status]}
        </span>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span>v{app.version}</span>
          <span className="flex items-center gap-1">
            <Download className="h-3.5 w-3.5" />
            {app.downloads.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t text-xs text-gray-400">
        Updated {formatDistanceToNow(new Date(app.updatedAt), { addSuffix: true })}
      </div>
    </div>
  );
}
