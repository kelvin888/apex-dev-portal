"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Link from "next/link";
import {
  Users,
  Search,
  ShieldOff,
  ShieldCheck,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface AdminDeveloper {
  id: string;
  name: string;
  email: string;
  organization?: string;
  role: string;
  suspended: boolean;
  verified: boolean;
  createdAt: string;
  appCount: number;
}

export default function AdminDevelopersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-developers", search],
    queryFn: () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const qs = params.toString();
      return api.get<{ developers: AdminDeveloper[]; total: number }>(
        qs ? `/admin/developers?${qs}` : "/admin/developers",
      );
    },
  });

  const suspendMutation = useMutation({
    mutationFn: ({ id, suspended }: { id: string; suspended: boolean }) =>
      api.patch(`/admin/developers/${id}/suspend`, { suspended }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-developers"] });
      queryClient.invalidateQueries({ queryKey: ["admin-developers-count"] });
    },
  });

  const developers = data?.developers ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Developers</h1>
        <p className="text-sm text-gray-500 mt-1">
          {total} registered developer{total === 1 ? "" : "s"}
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search developers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-9 w-full"
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {isLoading && (
          <div className="p-12 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
          </div>
        )}
        {!isLoading && developers.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <Users className="h-10 w-10 mx-auto text-gray-300 mb-2" />
            <p>No developers found</p>
          </div>
        )}
        {!isLoading && developers.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Developer
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Apps
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Joined
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Status
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {developers.map((dev) => {
                  let suspendIcon: React.ReactNode;
                  if (suspendMutation.isPending) {
                    suspendIcon = <Loader2 className="h-3 w-3 animate-spin" />;
                  } else if (dev.suspended) {
                    suspendIcon = <ShieldCheck className="h-3 w-3" />;
                  } else {
                    suspendIcon = <ShieldOff className="h-3 w-3" />;
                  }
                  const suspendClass = dev.suspended
                    ? "bg-success-50 text-success-700 border-success-200 hover:bg-success-100"
                    : "bg-error-50 text-error-700 border-error-200 hover:bg-error-100";
                  return (
                    <tr
                      key={dev.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/dashboard/admin/developers/${dev.id}`}
                          className="flex items-center gap-3 group"
                        >
                          <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-medium flex-shrink-0">
                            {dev.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                              {dev.name}
                            </div>
                            <div className="text-xs text-gray-400">
                              {dev.email}
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {dev.appCount}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {formatDistanceToNow(new Date(dev.createdAt), {
                          addSuffix: true,
                        })}
                      </td>
                      <td className="px-4 py-3">
                        {dev.suspended ? (
                          <span className="badge bg-error-100 text-error-700">
                            Suspended
                          </span>
                        ) : (
                          <span className="badge-success">Active</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() =>
                              suspendMutation.mutate({
                                id: dev.id,
                                suspended: !dev.suspended,
                              })
                            }
                            disabled={suspendMutation.isPending}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors disabled:opacity-50 ${suspendClass}`}
                          >
                            {suspendIcon}
                            {dev.suspended ? "Unsuspend" : "Suspend"}
                          </button>
                          <Link
                            href={`/dashboard/admin/developers/${dev.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            View
                            <ChevronRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
