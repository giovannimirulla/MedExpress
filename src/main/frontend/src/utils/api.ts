const BASE_URL = "http://localhost:8080/api/v1/";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  // Se l'endpoint contiene "auth", esegui la richiesta senza token
  if (endpoint.includes("auth")) {
    console.log(`${BASE_URL}${endpoint}`);
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    return response.json();
  }
  
  let accessToken = getCookie("access_token");

  // Se non c'è l'access token, prova a rinnovarlo con il refresh token
  if (!accessToken) {
    const newTokens = await refreshAccessToken();
    if (!newTokens) {
      throw new Error("Unauthorized - Please log in again.");
    }
    accessToken = newTokens.access_token;
  }

  // Aggiungi il token all'header Authorization
  const headers = {
    ...options.headers,
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  // Effettua la richiesta API con il token
  console.log(`${BASE_URL}${endpoint}`);
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Se il token è scaduto, prova a rinnovarlo e ripeti la richiesta
  if (response.status === 401) {
    const newTokens = await refreshAccessToken();
    if (!newTokens) {
      throw new Error("Unauthorized - Session expired.");
    }
    
    // Riprova la richiesta con il nuovo token
    return await apiFetch(endpoint, options);
  }

  return response.json();
}

// Funzione per rinnovare il token con il refresh token
async function refreshAccessToken() {
  const refreshToken = getCookie("refresh_token");
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${BASE_URL}auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    
    // Salviamo i nuovi token nei cookie
    document.cookie = `access_token=${data.access_token}; path=/; Secure;`;
    document.cookie = `refresh_token=${data.refresh_token}; path=/; Secure;`;

    return data;
  } catch {
    return null;
  }
}

// Funzione per leggere i cookie lato client
function getCookie(name: string) {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
}