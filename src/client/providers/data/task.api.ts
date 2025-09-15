import { fetchWrapper } from "./fetch-wrapper";

export const API_BASE_URL = "/api/v1/tasks";

/**
 * Fetches all tasks, or tasks filtered by provided criteria.
 * Aligns with a backend endpoint like GET /api/v1/tasks
 */
export async function getTasks(filters?: Record<string, any>) {
  const params = filters ? `?${new URLSearchParams(filters).toString()}` : "";
  const accessToken = localStorage.getItem("accessToken");
  return fetchWrapper(`${API_BASE_URL}${params}`, {
    method: "GET",
    headers: {
      "Cache-Control": "no-cache",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });
}

/**
 * Fetches a single task by its ID.
 * Aligns with a backend endpoint like GET /api/v1/tasks/:taskId
 */
export async function getTask(taskId: string) {
  const accessToken = localStorage.getItem("accessToken");
  return fetchWrapper(`${API_BASE_URL}/${taskId}`, {
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });
}

/**
 * Fetches tasks assigned to the authenticated user by getting the user ID from local storage.
 * Aligns with a backend endpoint like GET /api/v1/tasks/my
 */
export async function getMyTasks(filters?: Record<string, any>) {
  try {
    const params = filters ? `?${new URLSearchParams(filters).toString()}` : "";
    const url = `${API_BASE_URL}/my${params}`;
    const accessToken = localStorage.getItem("accessToken");
    const data = await fetchWrapper(url, {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    });
    return data;
  } catch (error) {
    console.error("Error fetching my tasks:", error);
    return { items: [], total: 0 };
  }
}
// data/task.api.ts
export async function createTask(data: { title: string; description: string;status: string }) {
  return fetchWrapper(`${API_BASE_URL}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
}


export async function updateTask(taskId: string, data: any) {
  return fetchWrapper(`${API_BASE_URL}/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
}

export async function deleteTask(taskId: string) {
  return fetchWrapper(`${API_BASE_URL}/${taskId}`, {
    method: "DELETE",
  });
}
// Các action PATCH
export async function assignTask(taskId: string, assigneeIds: string[]) {
  return fetchWrapper(`${API_BASE_URL}/assign/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify({ assigneeIds }),
    headers: { "Content-Type": "application/json" },
  });
}

// Hàm để bỏ gán một người dùng khỏi một công việc
export async function unassignTask(taskId: string, userId: string) {
  return fetchWrapper(`${API_BASE_URL}/unassign/${taskId}/${userId}`, {
    method: "PATCH",
  });
}

export async function changeTaskStatus(taskId: string, status: string) {
  return fetchWrapper(`${API_BASE_URL}/${taskId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
    headers: { "Content-Type": "application/json" },
  });
}

export async function updateTaskPriority(taskId: string, priority: string) {
  return fetchWrapper(`${API_BASE_URL}/${taskId}/priority`, {
    method: "PATCH",
    body: JSON.stringify({ priority }),
    headers: { "Content-Type": "application/json" },
  });
}

export async function markTaskCompleted(taskId: string) {
  return fetchWrapper(`${API_BASE_URL}/${taskId}/complete`, {
    method: "PATCH",
  });
}

// Thống kê
export async function getTaskStatsByStatus(): Promise<Record<string, number>> {
  return fetchWrapper(`${API_BASE_URL}/stats/status`, {});
}

export async function getTaskStatsByPriority(): Promise<Record<string, number>> {
  return fetchWrapper(`${API_BASE_URL}/stats/priority`, {});
}
