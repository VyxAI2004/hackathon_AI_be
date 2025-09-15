import { jwtDecode } from "jwt-decode";

export const customFetch = async (url: string, options: RequestInit = {}) => {
  let accessToken = localStorage.getItem("access_token");
  // const userId = localStorage.getItem("user_id"); // KHÔNG tự động lấy user_id và thêm vào body nữa

  const headers = options.headers ? (options.headers as Record<string, string>) : {};

  const makeRequest = async () =>
    fetch(url, {
      ...options,
      headers: {
        ...headers,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

  let response = await makeRequest();

  if (response.status === 401) {
    const refreshToken = localStorage.getItem("refresh_token");
    if (refreshToken) {
      try {
        const refreshResponse = await fetch("/auth/refresh-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (refreshResponse.ok) {
          const { access_token, expires_in } = await refreshResponse.json();
          localStorage.setItem("access_token", access_token);
          localStorage.setItem("access_token_expiry", (Date.now() + expires_in * 1000).toString());

          // Cập nhật user_id từ token mới
          const decoded: { id: string } = jwtDecode(access_token);
          localStorage.setItem("user_id", decoded.id);

          accessToken = access_token;
          response = await makeRequest();
        } else {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("access_token_expiry");
          localStorage.removeItem("user_id");
        }
      } catch {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("access_token_expiry");
        localStorage.removeItem("user_id");
      }
    }
  }
  // Xử lý 204 No Content hoặc 200 OK với body rỗng (DELETE)
  if (response.status === 204) {
    return null;
  }
  // Một số backend trả về 200 OK nhưng không có body (DELETE)
  if (response.status === 200) {
    const text = await response.text();
    if (!text) return null;
    try {
      const data = JSON.parse(text);
      if (!response.ok) {
        throw { message: data?.message || "Unknown error", statusCode: response.status };
      }
      return data;
    } catch (e) {
      // Nếu không phải JSON, chỉ trả về null
      return null;
    }
  }
  // Các trường hợp khác (có body JSON)
  try {
    const data = await response.json();
    if (!response.ok) {
      throw { message: data?.message || "Unknown error", statusCode: response.status };
    }
    return data;
  } catch (err) {
    // Log lỗi parse JSON để debug
    console.error("fetch-wrapper parse error", err);
    if (!response.ok) {
      throw { message: "Unknown error", statusCode: response.status };
    }
    return null;
  }
};

export const fetchWrapper = async (url: string, options: RequestInit = {}) => customFetch(url, options);
