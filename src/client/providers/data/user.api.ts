import { fetchWrapper } from "./fetch-wrapper";

export const API_BASE_URL = "/api/v1/users";

// --- GET ALL USERS ---
export async function getUsers() {
  return fetchWrapper(`${API_BASE_URL}`, {});
}

// --- GET SINGLE USER ---
export async function getUser(userId: string) {
  return fetchWrapper(`${API_BASE_URL}/${userId}`, {});
}

// --- GET USER BY EMAIL (optional password for login check) ---
export async function getUserByEmail(email: string, password?: string) {
  return fetchWrapper(`${API_BASE_URL}/email/${email}`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: { "Content-Type": "application/json" },
  });
}

// --- LOGIN ---
export async function loginUser(email: string, password: string) {
  return fetchWrapper(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: { "Content-Type": "application/json" },
  });
}

// --- REFRESH ACCESS TOKEN ---
export async function refreshAccessToken(refreshToken: string) {
  return fetchWrapper(`${API_BASE_URL}/auth/refresh-token`, {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
    headers: { "Content-Type": "application/json" },
  });
}

// --- LOGOUT ---
export async function logoutUser(refreshToken: string) {
  return fetchWrapper(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
    headers: { "Content-Type": "application/json" },
  });
}

// --- SEARCH USERS WITH QUERY ---
export async function searchUsers(query: Record<string, any>) {
  const params = new URLSearchParams(query).toString();
  return fetchWrapper(`${API_BASE_URL}?${params}`, {});
}

// --- CREATE USER ---
export async function createUser(data: any) {
  return fetchWrapper(`${API_BASE_URL}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
}

// --- UPDATE USER ---
export async function updateUser(userId: string, data: any) {
  return fetchWrapper(`${API_BASE_URL}/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
}

// --- DELETE USER ---
export async function deleteUser(userId: string) {
  return fetchWrapper(`${API_BASE_URL}/${userId}`, {
    method: "DELETE",
  });
}
