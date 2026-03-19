"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useRoleGuard } from "@/lib/auth-context";
import Link from "next/link";
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
  EyeOff,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface App {
  id: string;
  appId: string;
  name: string;
  description?: string;
  icon?: string;
  status: "draft" | "pending" | "approved" | "rejected" | "suspended";
  latestVersion?: string;
  totalDownloads: number;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export default function AppsPage() {
  useRoleGuard("developer");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const { data: appsResponse, isLoading } = useQuery({
    queryKey: ["apps", search, filter],
    queryFn: () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (filter && filter !== "all") params.set("status", filter);
      const queryString = params.toString();
      const url = queryString ? `/apps?${queryString}` : "/apps";
      return api.get<{ apps: App[]; total: number }>(url);
    },
  });

  const apps = appsResponse?.apps || [];

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
          {["all", "approved", "pending", "draft"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === status
                  ? "bg-primary-50 text-primary-600"
                  : "text-gray-600 hover:bg-gray-100"
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
      ) : null}
      {!isLoading && apps.length === 0 ? (
        <div className="card p-12 text-center">
          <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="font-medium text-gray-900 mb-1">No apps found</h3>
          <p className="text-gray-500 mb-4">
            {search
              ? "Try a different search term"
              : "You haven't created any apps yet"}
          </p>
          <Link href="/dashboard/apps/new" className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First App
          </Link>
        </div>
      ) : null}
      {!isLoading && apps.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {apps.map((app) => (
            <AppCard key={app.appId} app={app} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function AppCard({ app }: Readonly<{ app: App }>) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const queryClient = useQueryClient();

  const unpublishMutation = useMutation({
    mutationFn: () => api.post(`/apps/${app.appId}/unpublish`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apps"] });
      setMenuOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/apps/${app.appId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apps"] });
      setShowDeleteConfirm(false);
    },
  });

  const handleDeleteClick = () => {
    setMenuOpen(false);
    setShowDeleteConfirm(true);
  };

  const statusColors: Record<string, string> = {
    approved: "badge-success",
    pending: "badge-warning",
    draft: "badge-info",
    rejected: "badge-error",
    suspended: "badge-error",
  };

  const statusLabels: Record<string, string> = {
    approved: "Approved",
    pending: "Pending Review",
    draft: "Draft",
    rejected: "Rejected",
    suspended: "Suspended",
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
              href={`/dashboard/apps/${app.appId}`}
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
                  <button
                    aria-label="Close menu"
                    className="fixed inset-0 z-10 cursor-default bg-transparent border-0"
                    onClick={() => setMenuOpen(false)}
                    onKeyDown={(e) => e.key === "Escape" && setMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-lg border z-20">
                    <Link
                      href={`/dashboard/apps/${app.appId}`}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Link>
                    <Link
                      href={`/dashboard/apps/${app.appId}/edit`}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Link>
                    {app.status === "approved" && (
                      <a
                        href={`apex://${app.appId}`}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open in App
                      </a>
                    )}
                    {app.status === "approved" && (
                      <button
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-warning-600 hover:bg-warning-50 disabled:opacity-50"
                        disabled={unpublishMutation.isPending}
                        onClick={() => unpublishMutation.mutate()}
                      >
                        {unpublishMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                        Unpublish
                      </button>
                    )}
                    <button
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error-600 hover:bg-error-50 disabled:opacity-50"
                      disabled={deleteMutation.isPending}
                      onClick={handleDeleteClick}
                    >
                      {deleteMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
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
          {app.latestVersion && <span>v{app.latestVersion}</span>}
          <span className="flex items-center gap-1">
            <Download className="h-3.5 w-3.5" />
            {app.totalDownloads.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t text-xs text-gray-400">
        Updated{" "}
        {formatDistanceToNow(new Date(app.updatedAt), { addSuffix: true })}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="bg-white rounded-xl max-w-md w-full mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-error-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Trash2 className="h-5 w-5 text-error-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Delete App?
              </h3>
            </div>
            <p className="text-gray-600 mt-2">
              Are you sure you want to permanently delete{" "}
              <strong>{app.name}</strong>? All versions and data will be
              removed. This cannot be undone.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-secondary flex-1"
                disabled={deleteMutation.isPending}
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
                className="btn-danger flex-1"
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Delete permanently"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
