"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

const schema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  category: z.string().min(1, "Please select a category"),
  icon: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

const categories = [
  { value: "shopping", label: "Shopping & E-commerce" },
  { value: "food", label: "Food & Delivery" },
  { value: "finance", label: "Finance & Payments" },
  { value: "entertainment", label: "Entertainment" },
  { value: "travel", label: "Travel & Transport" },
  { value: "health", label: "Health & Fitness" },
  { value: "education", label: "Education" },
  { value: "utilities", label: "Utilities" },
  { value: "social", label: "Social & Communication" },
  { value: "business", label: "Business & Productivity" },
  { value: "other", label: "Other" },
];

interface AppDetails {
  appId: string;
  name: string;
  description?: string;
  category: string;
  icon?: string;
}

export default function EditAppPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: app, isLoading } = useQuery({
    queryKey: ["app", params.id],
    queryFn: () => api.get<AppDetails>(`/apps/${params.id}`),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Populate form once data is loaded
  useEffect(() => {
    if (app) {
      reset({
        name: app.name,
        description: app.description ?? "",
        category: app.category ?? "",
        icon: app.icon ?? "",
      });
    }
  }, [app, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      api.patch(`/apps/${params.id}`, {
        name: data.name,
        description: data.description || undefined,
        category: data.category,
        icon: data.icon || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["app", params.id] });
      queryClient.invalidateQueries({ queryKey: ["apps"] });
      router.push(`/dashboard/apps/${params.id}`);
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

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

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href={`/dashboard/apps/${params.id}`}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to {app.name}
        </Link>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Edit App</h1>
            <p className="text-sm text-gray-500 font-mono mt-0.5">
              {app.appId}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card-body space-y-6">
          {/* Name */}
          <div>
            <label className="label" htmlFor="name">
              App Name <span className="text-error-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              className={`input ${errors.name ? "border-error-500" : ""}`}
              placeholder="My Super App"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-error-600 text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              className={`input resize-none ${errors.description ? "border-error-500" : ""}`}
              placeholder="What does your app do?"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-error-600 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="label" htmlFor="category">
              Category <span className="text-error-500">*</span>
            </label>
            <select
              id="category"
              className={`input ${errors.category ? "border-error-500" : ""}`}
              {...register("category")}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-error-600 text-sm mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Icon URL */}
          <div>
            <label className="label" htmlFor="icon">
              Icon URL
            </label>
            <input
              id="icon"
              type="url"
              className={`input ${errors.icon ? "border-error-500" : ""}`}
              placeholder="https://example.com/icon.png"
              {...register("icon")}
            />
            {errors.icon && (
              <p className="text-error-600 text-sm mt-1">
                {errors.icon.message}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Recommended: 512×512px PNG or SVG
            </p>
          </div>

          {/* Server error */}
          {mutation.isError && (
            <div className="p-3 bg-error-50 border border-error-200 rounded-lg text-sm text-error-700">
              {(mutation.error as Error).message}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Link
              href={`/dashboard/apps/${params.id}`}
              className="btn-secondary flex-1 text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={mutation.isPending || !isDirty}
              className="btn-primary flex-1"
            >
              {mutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
