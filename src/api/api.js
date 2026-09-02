const API_BASE_URL = import.meta.env.VITE_API_BASE_URI || "http://localhost:8080/api";


const request = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URI}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));

    console.error("❌ Backend error:", error);

    throw new Error(
      error.message || `Request failed: ${response.status}`
    );
  }

  // 204 No Content
  if (response.status === 204) {
    return null;
  }

  return response.json();
};


// =====================================================
// GET
// =====================================================

const get = (endpoint, options = {}) => {

  let finalEndpoint = endpoint;

  // -----------------------------------------------
  // Convert params object into query parameters
  // -----------------------------------------------

  if (options.params) {

    const queryParams = new URLSearchParams();

    Object.entries(options.params).forEach(
      ([key, value]) => {

        if (
          value !== undefined &&
          value !== null
        ) {
          queryParams.append(
            key,
            String(value)
          );
        }

      }
    );

    const queryString =
      queryParams.toString();

    if (queryString) {

      finalEndpoint +=
        endpoint.includes("?")
          ? `&${queryString}`
          : `?${queryString}`;

    }
  }

  return request(finalEndpoint, {
    method: "GET",
    headers: options.headers,
  });
};


// =====================================================
// POST
// =====================================================

const post = (
  endpoint,
  data,
  options = {}
) =>
  request(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
    ...options,
  });


// =====================================================
// PUT
// =====================================================

const put = (
  endpoint,
  data,
  options = {}
) =>
  request(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
    ...options,
  });


// =====================================================
// PATCH
// =====================================================

const patch = (
  endpoint,
  data,
  options = {}
) =>
  request(endpoint, {
    method: "PATCH",
    body: JSON.stringify(data),
    ...options,
  });


// =====================================================
// DELETE
// =====================================================

const del = (
  endpoint,
  options = {}
) =>
  request(endpoint, {
    method: "DELETE",
    ...options,
  });


// =====================================================
// API OBJECT
// =====================================================

const api = {
  get,
  post,
  put,
  patch,
  delete: del,
};

export default api;