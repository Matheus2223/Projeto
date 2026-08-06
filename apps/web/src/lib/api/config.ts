// Server-only: base URL and credentials for the NestJS backend (apps/api).
// Never import this module from a "use client" component.

export const API_URL = process.env.API_URL ?? "http://localhost:3333/api/v1";

export const API_DEMO_EMAIL = process.env.API_DEMO_EMAIL ?? "equipe@provedor.com.br";
export const API_DEMO_PASSWORD = process.env.API_DEMO_PASSWORD ?? "trendhub123";
