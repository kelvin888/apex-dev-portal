"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import {
  User,
  Mail,
  Building2,
  Lock,
  Bell,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";

interface ProfileUpdateData {
  name: string;
  company: string;
}

interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
}

export default function SettingsPage() {
  const { user } = useAuth();

  const [name, setName] = useState(user?.name ?? "");
  const [company, setCompany] = useState(user?.company ?? "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [emailNotifs, setEmailNotifs] = useState(true);
  const [releaseAlerts, setReleaseAlerts] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);

  const profileMutation = useMutation({
    mutationFn: (data: ProfileUpdateData) => api.patch("/auth/profile", data),
  });

  const passwordMutation = useMutation({
    mutationFn: (data: PasswordUpdateData) => api.patch("/auth/password", data),
    onSuccess: () => {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError(null);
    },
  });

  const notifMutation = useMutation({
    mutationFn: (data: object) => api.patch("/auth/notifications", data),
  });

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    profileMutation.mutate({ name, company });
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    passwordMutation.mutate({ currentPassword, newPassword });
  };

  const handleNotifSave = (e: React.FormEvent) => {
    e.preventDefault();
    notifMutation.mutate({ emailNotifs, releaseAlerts, securityAlerts });
  };

  let profileBtnLabel: React.ReactNode = "Save Changes";
  if (profileMutation.isPending)
    profileBtnLabel = <Loader2 className="h-4 w-4 animate-spin" />;
  else if (profileMutation.isSuccess)
    profileBtnLabel = (
      <>
        <Check className="h-4 w-4 mr-1" />
        Saved
      </>
    );

  let pwUpdateLabel: React.ReactNode = "Update Password";
  if (passwordMutation.isPending)
    pwUpdateLabel = <Loader2 className="h-4 w-4 animate-spin" />;
  else if (passwordMutation.isSuccess)
    pwUpdateLabel = (
      <>
        <Check className="h-4 w-4 mr-1" />
        Password Updated
      </>
    );

  let notifBtnLabel: React.ReactNode = "Save Preferences";
  if (notifMutation.isPending)
    notifBtnLabel = <Loader2 className="h-4 w-4 animate-spin" />;
  else if (notifMutation.isSuccess)
    notifBtnLabel = (
      <>
        <Check className="h-4 w-4 mr-1" />
        Saved
      </>
    );

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your account preferences
        </p>
      </div>

      {/* Profile */}
      <section className="card">
        <div className="card-header flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <h2 className="font-semibold">Profile</h2>
        </div>
        <form onSubmit={handleProfileSave} className="card-body space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-2xl font-bold select-none">
              {(name || user?.name || "?")[0].toUpperCase()}
            </div>
            <div className="text-sm text-gray-500">
              <div className="font-medium text-gray-900">{user?.email}</div>
              <div className="capitalize">{user?.role} account</div>
            </div>
          </div>

          <div>
            <label htmlFor="name" className="label">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input pl-9"
                placeholder="Your full name"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="label">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="email"
                type="email"
                value={user?.email ?? ""}
                readOnly
                disabled
                className="input pl-9 bg-gray-50 text-gray-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label htmlFor="company" className="label">
              Company{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="input pl-9"
                placeholder="Your company or organization"
              />
            </div>
          </div>

          {profileMutation.isError && (
            <div className="flex items-center gap-2 bg-error-50 border border-error-100 text-error-600 px-4 py-3 rounded-lg text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {(profileMutation.error as { message?: string })?.message ??
                "Failed to update profile"}
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={profileMutation.isPending}
              className="btn-primary"
            >
              {profileBtnLabel}
            </button>
          </div>
        </form>
      </section>

      {/* Password */}
      <section className="card">
        <div className="card-header flex items-center gap-2">
          <Lock className="h-4 w-4 text-gray-500" />
          <h2 className="font-semibold">Password</h2>
        </div>
        <form onSubmit={handlePasswordSave} className="card-body space-y-4">
          {/* Hidden username field for password manager accessibility */}
          <input
            type="text"
            name="username"
            autoComplete="username"
            value={user?.email ?? ""}
            readOnly
            className="hidden"
            aria-hidden="true"
          />
          <div>
            <label htmlFor="currentPassword" className="label">
              Current Password
            </label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="input"
              autoComplete="current-password"
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="label">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input"
              autoComplete="new-password"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="label">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input"
              autoComplete="new-password"
            />
          </div>

          {(passwordError || passwordMutation.isError) && (
            <div className="flex items-center gap-2 bg-error-50 border border-error-100 text-error-600 px-4 py-3 rounded-lg text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {passwordError ??
                (passwordMutation.error as { message?: string })?.message ??
                "Failed to update password"}
            </div>
          )}

          <button
            type="submit"
            disabled={
              !currentPassword ||
              !newPassword ||
              !confirmPassword ||
              passwordMutation.isPending
            }
            className="btn-primary"
          >
            {pwUpdateLabel}
          </button>
        </form>
      </section>

      {/* Notifications */}
      <section className="card">
        <div className="card-header flex items-center gap-2">
          <Bell className="h-4 w-4 text-gray-500" />
          <h2 className="font-semibold">Notifications</h2>
        </div>
        <form onSubmit={handleNotifSave} className="card-body space-y-4">
          {(
            [
              {
                id: "emailNotifs",
                label: "Email notifications",
                description: "Receive important account updates by email",
                value: emailNotifs,
                setter: setEmailNotifs,
              },
              {
                id: "releaseAlerts",
                label: "Release alerts",
                description:
                  "Get notified when your app packages are published",
                value: releaseAlerts,
                setter: setReleaseAlerts,
              },
              {
                id: "securityAlerts",
                label: "Security alerts",
                description: "Receive alerts for suspicious account activity",
                value: securityAlerts,
                setter: setSecurityAlerts,
              },
            ] as const
          ).map(({ id, label, description, value, setter }) => (
            <label
              key={id}
              htmlFor={id}
              aria-label={label}
              className="flex items-start gap-3 cursor-pointer"
            >
              <input
                id={id}
                type="checkbox"
                checked={value}
                onChange={(e) => setter(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <div>
                <div className="text-sm font-medium text-gray-900">{label}</div>
                <div className="text-sm text-gray-500">{description}</div>
              </div>
            </label>
          ))}

          {notifMutation.isError && (
            <div className="flex items-center gap-2 bg-error-50 border border-error-100 text-error-600 px-4 py-3 rounded-lg text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {(notifMutation.error as { message?: string })?.message ??
                "Failed to save preferences"}
            </div>
          )}

          <button
            type="submit"
            disabled={notifMutation.isPending}
            className="btn-primary"
          >
            {notifBtnLabel}
          </button>
        </form>
      </section>
    </div>
  );
}
