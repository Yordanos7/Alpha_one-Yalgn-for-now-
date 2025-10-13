import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  fetch(url: RequestInfo, options?: RequestInit) {
    return fetch(url, {
      ...options,
      credentials: "include",
    });
  },
});
