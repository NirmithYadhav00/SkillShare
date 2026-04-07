const trimTrailingSlash = (value = "") => value.replace(/\/+$/, "");

export const FRONTEND_URL = trimTrailingSlash(
  import.meta.env.VITE_FRONTEND_URL || window.location.origin
);

export const API_BASE_URL = trimTrailingSlash(
  import.meta.env.VITE_API_BASE_URL || "https://skillshare-ebe1.onrender.com"
);

export const BACKEND_URL = API_BASE_URL.replace(/\/api$/, "");

export const apiUrl = (path = "") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
