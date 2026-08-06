import { API_URL, API_DEMO_EMAIL, API_DEMO_PASSWORD } from "./config";

// Server-only. Bridges the Next.js server to the NestJS backend, which
// guards every domain endpoint with JwtAuthGuard. Rather than asking every
// visitor to log in, the frontend authenticates once as a seeded demo user
// and reuses that token server-side — the token never reaches the browser.

interface CachedToken {
  token: string;
  expiresAt: number;
}

let cached: CachedToken | null = null;
let pending: Promise<string> | null = null;

function decodeExpiry(token: string): number {
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString("utf8"));
    return typeof payload.exp === "number" ? payload.exp * 1000 : Date.now() + 60_000;
  } catch {
    return Date.now() + 60_000;
  }
}

async function login(): Promise<string> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: API_DEMO_EMAIL, password: API_DEMO_PASSWORD }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Backend auth failed: ${res.status}`);
  }

  const data = (await res.json()) as { accessToken: string };
  return data.accessToken;
}

export async function getServiceToken(): Promise<string> {
  const safetyMarginMs = 60_000;
  if (cached && cached.expiresAt - safetyMarginMs > Date.now()) {
    return cached.token;
  }

  if (!pending) {
    pending = login()
      .then((token) => {
        cached = { token, expiresAt: decodeExpiry(token) };
        return token;
      })
      .finally(() => {
        pending = null;
      });
  }

  return pending;
}
