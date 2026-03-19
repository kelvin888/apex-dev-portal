"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useRoleGuard } from "@/lib/auth-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2, Upload, Info } from "lucide-react";
import Link from "next/link";

const schema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  appId: z
    .string()
    .regex(
      /^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*){2,}$/,
      "Must be in reverse domain format (e.g., com.company.app)",
    ),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  category: z.string().min(1, "Please select a category"),
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

export default function NewAppPage() {
  useRoleGuard("developer");
  const router = useRouter();
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      appId: "",
      description: "",
      category: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => api.post("/apps", data),
    onSuccess: (data: any) => {
      router.push(`/dashboard/apps/${data.id}`);
    },
  });

  const name = watch("name");

  // Auto-generate appId from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    const currentAppId = watch("appId");

    // Only auto-generate if appId is empty or was auto-generated before
    if (!currentAppId || currentAppId.startsWith("com.apex.")) {
      const slug = newName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "")
        .slice(0, 20);
      if (slug) {
        setValue("appId", `com.apex.${slug}`);
      }
    }
  };

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setIconPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard/apps"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Apps
        </Link>
      </div>

      <div className="card">
        <div className="card-header">
          <h1 className="text-xl font-semibold text-gray-900">
            Create New App
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the details to create your new mini-app
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card-body space-y-6">
          {mutation.isError && (
            <div className="bg-error-50 border border-error-100 text-error-600 px-4 py-3 rounded-lg text-sm">
              {(mutation.error as any)?.message || "Failed to create app"}
            </div>
          )}

          {/* App Icon */}
          <div>
            <label className="label">App Icon</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                {iconPreview ? (
                  <img
                    src={iconPreview}
                    alt="Icon preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Upload className="h-6 w-6 text-gray-400" />
                )}
              </div>
              <div>
                <label className="btn-secondary cursor-pointer">
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={handleIconChange}
                    className="sr-only"
                  />
                  Upload Icon
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  PNG or JPEG, 512x512px recommended
                </p>
              </div>
            </div>
          </div>

          {/* App Name */}
          <div>
            <label htmlFor="name" className="label">
              App Name *
            </label>
            <input
              id="name"
              type="text"
              {...register("name", { onChange: handleNameChange })}
              className={`input ${errors.name ? "border-error-500" : ""}`}
              placeholder="My Awesome App"
            />
            {errors.name && (
              <p className="text-sm text-error-500 mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* App ID */}
          <div>
            <label htmlFor="appId" className="label">
              App ID *
            </label>
            <input
              id="appId"
              type="text"
              {...register("appId")}
              className={`input font-mono text-sm ${
                errors.appId ? "border-error-500" : ""
              }`}
              placeholder="com.company.appname"
            />
            {errors.appId ? (
              <p className="text-sm text-error-500 mt-1">
                {errors.appId.message}
              </p>
            ) : (
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <Info className="h-3 w-3" />
                Unique identifier in reverse domain format
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="label">
              Category *
            </label>
            <select
              id="category"
              {...register("category")}
              className={`input ${errors.category ? "border-error-500" : ""}`}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-sm text-error-500 mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="label">
              Description
            </label>
            <textarea
              id="description"
              {...register("description")}
              rows={4}
              className={`input resize-none ${
                errors.description ? "border-error-500" : ""
              }`}
              placeholder="Describe what your app does..."
            />
            {errors.description && (
              <p className="text-sm text-error-500 mt-1">
                {errors.description.message}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {(watch("description") || "").length}/500 characters
            </p>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Link href="/dashboard/apps" className="btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="btn-primary"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Creating...
                </>
              ) : (
                "Create App"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
