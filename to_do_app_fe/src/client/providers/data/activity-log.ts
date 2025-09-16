import { fetchWrapper } from "./fetch-wrapper";

export const API_BASE_URL = "/api/v1/activity-logs";

export async function getActivityLogsByUser(filters?: Record<string, any>) {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      throw new Error("User ID not found in localStorage");
    }

    const allFilters = {
      ...filters,
      user_id: userId,
    };

    const params = new URLSearchParams(allFilters).toString();
    const url = `${API_BASE_URL}?${params}`;

    const data = await fetchWrapper(url, {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache",
      },
    });

    if (Array.isArray(data)) {
      return {
        items: data,
        total: data.length, 
      };
    }
    return {
      items: data.items || [],
      total: data.total || 0,
    };

  } catch (error) {
    console.error("Error fetching my activity logs:", error);
    return { items: [], total: 0 };
  }
}