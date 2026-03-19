"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  Key,
  Plus,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  AlertCircle,
  Check,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  lastUsedAt?: string;
  createdAt: string;
  expiresAt?: string;
}

interface NewKeyResponse {
  id: string;
  name: string;
  key: string;
}

export default function ApiKeysPage() {
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKey, setNewKey] = useState<NewKeyResponse | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data: keysData, isLoading } = useQuery({
    queryKey: ["api-keys"],
    queryFn: () => api.get<{ keys: ApiKey[] }>("/auth/api-keys"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/auth/api-keys/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    },
  });

  const displayKeys = Array.isArray(keysData?.keys)
    ? keysData!.keys
    : Array.isArray(keysData)
      ? (keysData as unknown as ApiKey[])
      : [];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">API Keys</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage API keys for the APEX CLI and CI/CD integration
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          New API Key
        </button>
      </div>

      {/* Warning */}
      <div className="bg-warning-50 border border-warning-100 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-warning-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-warning-800">
          <strong>Keep your API keys secure.</strong> Never share them publicly
          or commit them to version control. Use environment variables instead.
        </div>
      </div>

      {/* Keys List */}
      <div className="card">
        {isLoading ? (
          <div className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary-500 mx-auto" />
          </div>
        ) : (
          <>
            {displayKeys.length === 0 ? (
              <div className="p-12 text-center">
                <Key className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="font-medium text-gray-900 mb-1">No API keys</h3>
                <p className="text-gray-500 mb-4">
                  Create an API key to use the APEX CLI or integrate with CI/CD
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First API Key
                </button>
              </div>
            ) : (
              <div className="divide-y">
                {displayKeys.map((key) => (
                  <div
                    key={key.id}
                    className="p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Key className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {key.name}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="text-sm text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
                            {key.keyPrefix}••••••••
                          </code>
                          <button
                            onClick={() =>
                              copyToClipboard(
                                `${key.keyPrefix}••••••••`,
                                key.id,
                              )
                            }
                            className="p-1 rounded hover:bg-gray-100"
                            title="Copy key prefix"
                          >
                            {copiedId === key.id ? (
                              <Check className="h-4 w-4 text-success-600" />
                            ) : (
                              <Copy className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-sm text-right">
                        {key.lastUsedAt && (
                          <div className="text-gray-500">
                            Last used{" "}
                            {formatDistanceToNow(new Date(key.lastUsedAt), {
                              addSuffix: true,
                            })}
                          </div>
                        )}
                        <div className="text-gray-400">
                          Created{" "}
                          {format(new Date(key.createdAt), "MMM d, yyyy")}
                        </div>
                        {key.expiresAt && (
                          <div className="text-warning-600">
                            Expires{" "}
                            {format(new Date(key.expiresAt), "MMM d, yyyy")}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          if (
                            confirm(
                              `Are you sure you want to delete "${key.name}"?`,
                            )
                          ) {
                            deleteMutation.mutate(key.id);
                          }
                        }}
                        className="p-2 rounded-lg hover:bg-error-50 text-gray-400 hover:text-error-600"
                        title="Delete key"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Usage Examples */}
      <div className="card">
        <div className="card-header">
          <h2 className="font-semibold">Usage Examples</h2>
        </div>
        <div className="card-body space-y-4">
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">
              Environment Variable
            </div>
            <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
              export APEX_TOKEN=apex_prod_xxxxxxxxxxxx
            </pre>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">
              CLI Login
            </div>
            <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
              apex login --api-key apex_prod_xxxxxxxxxxxx
            </pre>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">
              GitHub Actions
            </div>
            <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
              {`- name: Publish to APEX
  run: apex publish
  env:
    APEX_TOKEN: \${{ secrets.APEX_TOKEN }}`}
            </pre>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateKeyModal
          onClose={() => {
            setShowCreateModal(false);
            setNewKey(null);
          }}
          onCreated={(key) => {
            setNewKey(key);
            queryClient.invalidateQueries({ queryKey: ["api-keys"] });
          }}
          newKey={newKey}
        />
      )}
    </div>
  );
}

function CreateKeyModal({
  onClose,
  onCreated,
  newKey,
}: Readonly<{
  onClose: () => void;
  onCreated: (key: NewKeyResponse) => void;
  newKey: NewKeyResponse | null;
}>) {
  const [name, setName] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const createMutation = useMutation({
    mutationFn: () =>
      api.post<NewKeyResponse>("/auth/api-keys", {
        name,
        permissions: ["read", "upload", "publish", "delete"],
      }),
    onSuccess: (data) => {
      onCreated(data);
    },
  });

  const copyKey = () => {
    if (newKey) {
      navigator.clipboard.writeText(newKey.key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-md w-full mx-4 p-6">
        {newKey ? (
          // Show new key
          <>
            <div className="text-center">
              <div className="w-12 h-12 bg-success-50 rounded-full flex items-center justify-center mx-auto">
                <Check className="h-6 w-6 text-success-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mt-4">
                API Key Created
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Copy your API key now. You won't be able to see it again.
              </p>
            </div>

            <div className="mt-6">
              <label className="label" htmlFor="new-api-key">
                Your API Key
              </label>
              <div className="relative">
                <input
                  id="new-api-key"
                  type={showKey ? "text" : "password"}
                  value={newKey.key}
                  readOnly
                  className="input pr-20 font-mono text-sm"
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    {showKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={copyKey}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-success-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-warning-50 border border-warning-100 rounded-lg p-3 mt-4">
              <p className="text-sm text-warning-800">
                <strong>Important:</strong> This is the only time you'll see
                this key. Store it securely.
              </p>
            </div>

            <button onClick={onClose} className="btn-primary w-full mt-6">
              Done
            </button>
          </>
        ) : (
          // Create form
          <>
            <h3 className="text-lg font-semibold text-gray-900">
              Create API Key
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Give your API key a name to help identify it later.
            </p>

            <div className="mt-6">
              <label htmlFor="keyName" className="label">
                Key Name
              </label>
              <input
                id="keyName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="e.g., Production, CI/CD, Development"
              />
            </div>

            {createMutation.isError && (
              <div className="bg-error-50 border border-error-100 text-error-600 px-4 py-3 rounded-lg text-sm mt-4">
                {(createMutation.error as any)?.message ||
                  "Failed to create key"}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button onClick={onClose} className="btn-secondary flex-1">
                Cancel
              </button>
              <button
                onClick={() => createMutation.mutate()}
                disabled={!name || createMutation.isPending}
                className="btn-primary flex-1"
              >
                {createMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Create Key"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
