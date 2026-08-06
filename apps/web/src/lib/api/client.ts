import { API_URL } from "./config";
import { getServiceToken } from "./auth";

// Server-only generic fetch wrapper for the NestJS backend. Every call is
// time-boxed and throws on failure — callers are expected to catch and fall
// back to the local mock data generators (see src/lib/data), which is what
// keeps every page working even when no backend is deployed alongside the
// frontend (e.g. a Vercel preview with no DATABASE_URL anywhere).
export async function apiFetch<T>(path: string, timeoutMs = 3000): Promise<T> {
  const token = await getServiceToken();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${API_URL}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`API ${path} responded ${res.status}`);
    }

    return (await res.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

export async function apiPost<T>(path: string, body: unknown, timeoutMs = 3000): Promise<T> {
  const token = await getServiceToken();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`API POST ${path} responded ${res.status}`);
    }

    return (await res.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}
