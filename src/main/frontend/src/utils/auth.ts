import { apiFetch } from "@/utils/api";

export async function login(email: string, password: string) {
  const data = await apiFetch("auth/login/user", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  // Salviamo i token nei cookie
  document.cookie = `access_token=${data.access_token}; path=/; Secure;`;
  document.cookie = `refresh_token=${data.refresh_token}; path=/; Secure;`;

  return data;
}

export async function signup(username: string, email: string, password: string) {
  return await apiFetch("users", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });
}

export function isLogged(): boolean {
    const match = document.cookie.match(new RegExp('(^| )access_token=([^;]+)'));
    return !!match;
  }