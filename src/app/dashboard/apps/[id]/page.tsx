"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  Download,
  Users,
  Star,
  Clock,
  Upload,
  Pencil,
  Trash2,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

interface AppDetails {
  id: string;
  appId: string;
  name: string;
  description?: string;
  icon?: string;
  status: "draft" | "review" | "published" | "rejected";
  category: string;
  createdAt: string;
  updatedAt: string;
  stats: {
    downloads: number;
    activeUsers: number;
    rating: number;
    reviews: number;
  };
  versions: Array<{
    id: string;
    version: string;
    status: "active" | "deprecated";
    downloads: number;
    createdAt: string;
  }>;
  permissions: string[];
}

export default function AppDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: app, isLoading } = useQuery({
    queryKey: ["app", params.id],
    queryFn: () => api.get<AppDetails>(`/apps/${params.id}`),
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/apps/${params.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apps"] });
      router.push("/dashboard/apps");
    },
  });

  const publishMutation = useMutation({
    mutationFn: () => api.post(`/apps/${params.id}/publish`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["app", params.id] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <Package className="h-12 w-12 text-gray-300 mb-3" />
        <p className="font-medium">App not found</p>
        <Link
          href="/dashboard/apps"
          className="text-sm text-primary-600 hover:underline mt-2"
        >
          Back to apps
        </Link>
      </div>
    );
  }

  const statusConfig: Record<
    string,
    { color: string; icon: React.ComponentType<any>; label: string }
  > = {
    published: {
      color: "text-success-600",
      icon: CheckCircle,
      label: "Published",
    },
    review: { color: "text-warning-600", icon: Clock, label: "In Review" },
    draft: { color: "text-gray-500", icon: Pencil, label: "Draft" },
    rejected: { color: "text-error-600", icon: AlertCircle, label: "Rejected" },
  };

  const StatusIcon = statusConfig[app.status].icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/apps"
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              {displayApp.icon ? (
                <img
                  src={displayApp.icon}
                  alt={displayApp.name}
                  className="w-full h-full rounded-xl object-cover"
                />
              ) : (
                <Package className="h-6 w-6 text-gray-400" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {displayApp.name}
              </h1>
              <p className="text-sm text-gray-500 font-mono">
                {displayApp.appId}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/apps/${params.id}/edit`}
            className="btn-secondary"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Link>
          {displayApp.status === "draft" && (
            <button
              onClick={() => publishMutation.mutate()}
              disabled={publishMutation.isPending}
              className="btn-primary"
            >
              {publishMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Submit for Review
            </button>
          )}
        </div>
      </div>

      {/* Status Banner */}
      <div
        className={`flex items-center gap-2 p-4 rounded-lg bg-gray-50 border ${
          displayApp.status === "rejected" ? "border-error-200 bg-error-50" : ""
        }`}
      >
        <StatusIcon
          className={`h-5 w-5 ${statusConfig[displayApp.status].color}`}
        />
        <span
          className={`font-medium ${statusConfig[displayApp.status].color}`}
        >
          {statusConfig[displayApp.status].label}
        </span>
        {displayApp.status === "published" && (
          <a
            href={`apex://${displayApp.appId}`}
            className="ml-auto flex items-center gap-1 text-sm text-primary-600 hover:underline"
          >
            Open in App
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <StatCard
          icon={Download}
          label="Total Downloads"
          value={displayApp.stats.downloads.toLocaleString()}
        />
        <StatCard
          icon={Users}
          label="Active Users"
          value={displayApp.stats.activeUsers.toLocaleString()}
        />
        <StatCard
          icon={Star}
          label="Rating"
          value={`${displayApp.stats.rating.toFixed(1)} (${displayApp.stats.reviews})`}
        />
        <StatCard
          icon={Clock}
          label="Last Updated"
          value={formatDistanceToNow(new Date(displayApp.updatedAt), {
            addSuffix: true,
          })}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="card">
            <div className="card-header">
              <h2 className="font-semibold">Description</h2>
            </div>
            <div className="card-body">
              <p className="text-gray-600">
                {displayApp.description || "No description provided."}
              </p>
            </div>
          </div>

          {/* Versions */}
          <div className="card">
            <div className="card-header flex items-center justify-between">
              <h2 className="font-semibold">Versions</h2>
              <Link
                href={`/dashboard/apps/${params.id}/versions/new`}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Upload New Version
              </Link>
            </div>
            <div className="divide-y">
              {displayApp.versions.map((version) => (
                <div
                  key={version.id}
                  className="p-4 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">v{version.version}</span>
                      {version.status === "active" ? (
                        <span className="badge-success">Active</span>
                      ) : (
                        <span className="badge text-gray-500 bg-gray-100">
                          Deprecated
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {format(new Date(version.createdAt), "MMM d, yyyy")} •{" "}
                      {version.downloads.toLocaleString()} downloads
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Details */}
          <div className="card">
            <div className="card-header">
              <h2 className="font-semibold">Details</h2>
            </div>
            <div className="card-body space-y-4">
              <div>
                <div className="text-sm text-gray-500">Category</div>
                <div className="font-medium capitalize">
                  {displayApp.category}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Created</div>
                <div className="font-medium">
                  {format(new Date(displayApp.createdAt), "MMM d, yyyy")}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Permissions</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {displayApp.permissions.map((perm) => (
                    <span
                      key={perm}
                      className="text-xs px-2 py-1 bg-gray-100 rounded"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="card">
            <div className="card-header">
              <h2 className="font-semibold">Quick Links</h2>
            </div>
            <div className="divide-y">
              <Link
                href={`/dashboard/apps/${params.id}/analytics`}
                className="flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <span className="text-sm">View Analytics</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>
              <Link
                href={`/dashboard/apps/${params.id}/reviews`}
                className="flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <span className="text-sm">Reviews & Feedback</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>
              <Link
                href={`/dashboard/apps/${params.id}/settings`}
                className="flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <span className="text-sm">App Settings</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="card border-error-200">
            <div className="card-header">
              <h2 className="font-semibold text-error-600">Danger Zone</h2>
            </div>
            <div className="card-body">
              <p className="text-sm text-gray-600 mb-4">
                Deleting this app will remove all versions and data. This action
                cannot be undone.
              </p>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="btn-danger w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete App
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900">Delete App?</h3>
            <p className="text-gray-600 mt-2">
              Are you sure you want to delete <strong>{displayApp.name}</strong>
              ? This will permanently remove the app and all its data.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-secondary flex-1"
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
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: Readonly<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}>) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary-50 rounded-lg">
          <Icon className="h-5 w-5 text-primary-600" />
        </div>
        <div>
          <div className="text-lg font-semibold text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{label}</div>
        </div>
      </div>
    </div>
  );
}
