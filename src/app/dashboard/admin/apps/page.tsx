"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import {
  Package,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface AdminApp {
  id: string;
  name: string;
  appId: string;
  description?: string;
  status: string;
  category?: string;
  createdAt: string;
  developerId: string;
  developerName: string;
  developerEmail: string;
}

const STATUS_TABS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Draft", value: "draft" },
];

function statusBadgeClass(status: string) {
  const map: Record<string, string> = {
    approved: "badge-success",
    pending: "badge-warning",
    rejected: "badge-error",
    draft: "badge-info",
    suspended: "bg-gray-100 text-gray-600 badge",
  };
  return map[status] ?? "badge";
}

interface ReviewModalProps {
  app: AdminApp;
  onClose: () => void;
}

function ReviewModal({ app, onClose }: Readonly<ReviewModalProps>) {
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState("");
  const [action, setAction] = useState<"approve" | "reject" | null>(null);

  const mutation = useMutation({
    mutationFn: ({ act, n }: { act: "approve" | "reject"; n: string }) =>
      api.patch(`/admin/apps/${app.appId}/review`, { action: act, notes: n }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-apps"] });
      queryClient.invalidateQueries({ queryKey: ["admin-pending-apps"] });
      queryClient.invalidateQueries({ queryKey: ["admin-all-apps-count"] });
      onClose();
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Review App</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="font-medium text-gray-900">{app.name}</div>
          <div className="text-sm text-gray-500 mt-1">{app.appId}</div>
          <div className="text-sm text-gray-500">by {app.developerName}</div>
        </div>

        <div>
          <label htmlFor="review-notes" className="label">
            Notes (optional)
          </label>
          <textarea
            id="review-notes"
            className="input w-full h-24 resize-none"
            placeholder="Add a review note or rejection reason..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {mutation.isError && (
          <div className="flex items-center gap-2 text-error-600 text-sm">
            <AlertCircle className="h-4 w-4" />
            Failed to submit review. Please try again.
          </div>
        )}

        <div className="flex gap-3">
          <button
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700 font-medium text-sm disabled:opacity-50"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate({ act: "approve", n: notes })}
          >
            {mutation.isPending && action === "approve" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            Approve
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-error-600 text-white rounded-lg hover:bg-error-700 font-medium text-sm disabled:opacity-50"
            disabled={mutation.isPending}
            onClick={() => {
              setAction("reject");
              mutation.mutate({ act: "reject", n: notes });
            }}
          >
            {mutation.isPending && action === "reject" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminAppsPage() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(searchParams.get("status") ?? "all");
  const [reviewApp, setReviewApp] = useState<AdminApp | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-apps", search, status],
    queryFn: () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (status !== "all") params.set("status", status);
      const qs = params.toString();
      return api.get<{ apps: AdminApp[]; total: number }>(
        qs ? `/admin/apps?${qs}` : "/admin/apps",
      );
    },
  });

  const apps = data?.apps ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="space-y-6">
      {reviewApp && (
        <ReviewModal app={reviewApp} onClose={() => setReviewApp(null)} />
      )}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">All Apps</h1>
        <p className="text-sm text-gray-500 mt-1">
          {total} app{total === 1 ? "" : "s"} on the platform
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search apps..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9 w-full"
          />
        </div>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatus(tab.value)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                status === tab.value
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {isLoading && (
          <div className="p-12 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
          </div>
        )}
        {!isLoading && apps.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <Package className="h-10 w-10 mx-auto text-gray-300 mb-2" />
            <p>No apps found</p>
          </div>
        )}
        {!isLoading && apps.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    App
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Developer
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Submitted
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {apps.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="h-4 w-4 text-gray-400" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {app.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            {app.appId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-gray-900">{app.developerName}</div>
                      <div className="text-xs text-gray-400">
                        {app.developerEmail}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={statusBadgeClass(app.status)}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {formatDistanceToNow(new Date(app.createdAt), {
                        addSuffix: true,
                      })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {app.status === "pending" && (
                        <button
                          onClick={() => setReviewApp(app)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-warning-50 text-warning-700 border border-warning-200 rounded-lg hover:bg-warning-100 transition-colors"
                        >
                          <Clock className="h-3 w-3" />
                          Review
                        </button>
                      )}
                      {app.status !== "pending" && app.status !== "draft" && (
                        <button
                          onClick={() => setReviewApp(app)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <CheckCircle className="h-3 w-3" />
                          Manage
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
