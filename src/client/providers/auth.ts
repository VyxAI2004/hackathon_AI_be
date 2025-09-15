import { jwtDecode } from "jwt-decode";
import type { AuthProvider } from "@refinedev/core";
import { loginUser, createUser, refreshAccessToken as refreshAccessTokenApi } from "./data/user.api";

const TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const TOKEN_EXP_KEY = "access_token_expiry";
const USER_ID_KEY = "user_id";

export const authProvider: AuthProvider & { register?: any; refreshAccessToken?: () => Promise<boolean> } = {
  login: async ({ email, password }) => {
    try {
      const response = await loginUser(email, password);

      if (response?.access_token && response?.refresh_token && response?.expires_in) {
        const { access_token, refresh_token, expires_in } = response;

        localStorage.setItem(TOKEN_KEY, access_token);
        localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
        localStorage.setItem(TOKEN_EXP_KEY, (Date.now() + expires_in * 1000).toString());

        // Lưu user_id từ access token
        const decoded: { id: string } = jwtDecode(access_token);
        localStorage.setItem(USER_ID_KEY, decoded.id);

        return { success: true, redirectTo: "/" };
      }

      return { success: false, error: { message: "Login failed", name: "Invalid credentials" } };
    } catch (e) {
      return { success: false, error: { message: "Login failed", name: "Invalid credentials" } };
    }
  },

  register: async ({ username, email, password }) => {
    try {
      await createUser({ username, email, password });
      return { success: true, redirectTo: "/login" };
    } catch (e) {
      return { success: false, error: { message: "Registration failed", name: "Invalid data" } };
    }
  },

  logout: async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXP_KEY);
    localStorage.removeItem(USER_ID_KEY);
    return { success: true, redirectTo: "/login" };
  },

  refreshAccessToken: async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) return false;

    try {
      const response = await refreshAccessTokenApi(refreshToken);
      const { access_token, expires_in } = response;

      localStorage.setItem(TOKEN_KEY, access_token);
      localStorage.setItem(TOKEN_EXP_KEY, (Date.now() + expires_in * 1000).toString());

      // Cập nhật lại user_id từ token mới
      const decoded: { id: string } = jwtDecode(access_token);
      localStorage.setItem(USER_ID_KEY, decoded.id);

      return true;
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(TOKEN_EXP_KEY);
      localStorage.removeItem(USER_ID_KEY);
      return false;
    }
  },

  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const expiry = localStorage.getItem(TOKEN_EXP_KEY);

    if (token && expiry && Date.now() < parseInt(expiry)) {
      return { authenticated: true };
    }

    const refreshed = await authProvider.refreshAccessToken?.();
    if (refreshed) return { authenticated: true };

    return { authenticated: false, redirectTo: "/login" };
  },

  getIdentity: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return undefined;

    try {
      const decoded: { id: string; email: string; name?: string; role?: string } = jwtDecode(token);
      return {
        id: decoded.id,
        name: decoded.name ?? "User",
        email: decoded.email,
        role: decoded.role,
      };
    } catch {
      return undefined;
    }
  },

  onError: async (error) => {
    if (error.statusCode === "UNAUTHENTICATED") {
      const refreshed = await authProvider.refreshAccessToken?.();
      if (refreshed) return { logout: false };
      return { logout: true };
    }
    return { error };
  },
};
