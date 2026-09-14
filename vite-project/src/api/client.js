// Centralized API Client with JWT Bearer Token Management & Auto-Refresh

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export function getAccessToken() {
  return localStorage.getItem('learnflow_admin_access');
}

export function getRefreshToken() {
  return localStorage.getItem('learnflow_admin_refresh');
}

export function setTokens(access, refresh) {
  if (access) localStorage.setItem('learnflow_admin_access', access);
  if (refresh) localStorage.setItem('learnflow_admin_refresh', refresh);
}

export function clearTokens() {
  localStorage.removeItem('learnflow_admin_access');
  localStorage.removeItem('learnflow_admin_refresh');
  localStorage.removeItem('learnflow_admin_user');
}

let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(callback) {
  refreshSubscribers.push(callback);
}

function onRefreshed(newAccessToken) {
  refreshSubscribers.forEach((cb) => cb(newAccessToken));
  refreshSubscribers = [];
}

async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) {
    clearTokens();
    return null;
  }

  try {
    const response = await fetch(`${BASE_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });

    if (!response.ok) {
      clearTokens();
      return null;
    }

    const data = await response.json();
    if (data.access) {
      setTokens(data.access, data.refresh);
      return data.access;
    }
    return null;
  } catch (err) {
    clearTokens();
    return null;
  }
}

export async function apiClient(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = getAccessToken();
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (netErr) {
    throw new ApiError('Network error. Please check your backend connection.', 0);
  }

  // Handle Token Expiry (401)
  if (response.status === 401 && getRefreshToken() && !options._isRetry) {
    if (!isRefreshing) {
      isRefreshing = true;
      const newToken = await refreshAccessToken();
      isRefreshing = false;
      if (newToken) {
        onRefreshed(newToken);
        return apiClient(endpoint, {
          ...options,
          _isRetry: true,
          headers: { ...headers, Authorization: `Bearer ${newToken}` },
        });
      }
    } else {
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((newToken) => {
          if (!newToken) {
            reject(new ApiError('Session expired. Please log in again.', 401));
            return;
          }
          resolve(
            apiClient(endpoint, {
              ...options,
              _isRetry: true,
              headers: { ...headers, Authorization: `Bearer ${newToken}` },
            })
          );
        });
      });
    }
  }

  // Handle Response Content
  let responseData = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      responseData = await response.json();
    } catch {
      responseData = null;
    }
  }

  if (!response.ok) {
    const errorMsg =
      responseData?.error ||
      responseData?.detail ||
      responseData?.message ||
      `Request failed with status ${response.status}`;
    
    throw new ApiError(errorMsg, response.status, responseData);
  }

  return responseData;
}
