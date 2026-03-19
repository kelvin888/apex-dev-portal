"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  Mail,
  Building2,
  Calendar,
  Download,
  ShieldOff,
  ShieldCheck,
  Loader2,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

interface DeveloperDetail {
  developer: {
    id: string;
    name: string;
    email: string;
    organization?: string;
    role: string;
    suspended: boolean;
    verified: boolean;
    createdAt: string;
  };
  apps: Array<{
    id: string;
    name: string;
    appId: string;
    status: string;
    category?: string;
    createdAt: string;
  }>;
  totalDownloads: number;
}

function statusBadgeClass(status: string) {
  const map: Record<string, string> = {
    approved: "badge-success",
    pending: "badge-warning",
    rejected: "badge-error",
    draft: "badge-info",
  };
  return map[status] ?? "badge";
}

export default function DeveloperDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-developer", id],
    queryFn: () => api.get<DeveloperDetail>(`/admin/developers/${id}`),
  });

  const suspendMutation = useMutation({
    mutationFn: (suspended: boolean) =>
      api.patch(`/admin/developers/${id}/suspend`, { suspended }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-developer", id] });
      queryClient.invalidateQueries({ queryKey: ["admin-developers"] });
      queryClient.invalidateQueries({ queryKey: ["admin-developers-count"] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center py-16 gap-4 text-gray-500">
        <AlertCircle className="h-8 w-8 text-error-400" />
        <p>Developer not found.</p>
        <button
          onClick={() => router.back()}
          className="text-primary-600 hover:underline text-sm"
        >
          Go back
        </button>
      </div>
    );
  }

  const { developer, apps, totalDownloads } = data;

  const suspendBtnClass = developer.suspended
    ? "bg-success-50 text-success-700 border-success-200 hover:bg-success-100"
    : "bg-error-50 text-error-700 border-error-200 hover:bg-error-100";
  let SuspendIcon: LucideIcon;
  if (suspendMutation.isPending) {
    SuspendIcon = Loader2;
  } else if (developer.suspended) {
    SuspendIcon = ShieldCheck;
  } else {
    SuspendIcon = ShieldOff;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/admin/developers"
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{developer.name}</h1>
          <p className="text-sm text-gray-500">{developer.email}</p>
        </div>
        {developer.suspended && (
          <span className="ml-auto badge bg-error-100 text-error-700">
            Suspended
          </span>
        )}
      </div>

      {/* Info card */}
      <div className="card">
        <div className="card-header">
          <h2 className="font-semibold text-gray-900">Account Details</h2>
        </div>
        <div className="card-body space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <div>
                <div className="text-gray-500 text-xs">Email</div>
                <div className="text-gray-900">{developer.email}</div>
              </div>
            </div>
            {developer.organization && (
              <div className="flex items-center gap-3 text-sm">
                <Building2 className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <div>
                  <div className="text-gray-500 text-xs">Organization</div>
                  <div className="text-gray-900">{developer.organization}</div>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <div>
                <div className="text-gray-500 text-xs">Joined</div>
                <div className="text-gray-900">
                  {format(new Date(developer.createdAt), "MMM d, yyyy")}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Download className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <div>
                <div className="text-gray-500 text-xs">Total Downloads</div>
                <div className="text-gray-900">
                  {totalDownloads.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Account status:{" "}
              <span
                className={
                  developer.suspended ? "text-error-600" : "text-success-600"
                }
              >
                {developer.suspended ? "Suspended" : "Active"}
              </span>
            </div>
            <button
              onClick={() => suspendMutation.mutate(!developer.suspended)}
              disabled={suspendMutation.isPending}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors disabled:opacity-50 ${suspendBtnClass}`}
            >
              <SuspendIcon
                className={`h-4 w-4${suspendMutation.isPending ? " animate-spin" : ""}`}
              />
              {developer.suspended ? "Unsuspend Account" : "Suspend Account"}
            </button>
          </div>
        </div>
      </div>

      {/* Apps */}
      <div className="card">
        <div className="card-header">
          <h2 className="font-semibold text-gray-900">Apps ({apps.length})</h2>
        </div>
        <div className="divide-y">
          {apps.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Package className="h-8 w-8 mx-auto text-gray-300 mb-2" />
              <p className="text-sm">No apps yet</p>
            </div>
          ) : (
            apps.map((app) => (
              <div key={app.id} className="flex items-center gap-3 p-4">
                <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {app.name}
                  </div>
                  <div className="text-xs text-gray-400">{app.appId}</div>
                </div>
                <span className={statusBadgeClass(app.status)}>
                  {app.status}
                </span>
                <div className="text-xs text-gray-400 hidden sm:block">
                  {formatDistanceToNow(new Date(app.createdAt), {
                    addSuffix: true,
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
