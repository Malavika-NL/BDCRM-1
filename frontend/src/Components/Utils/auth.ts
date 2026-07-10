export type UserRole = 'admin' | 'employee';

export type AuthUser = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  is_active?: boolean;
  phone_number?: string;
  designation?: string;
  department?: string;
  address?: string;
};

const TOKEN_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';
const USER_KEY = 'auth_user';

const REFRESH_URL = '/api/auth/refresh/';
const TOKEN_REFRESH_BUFFER_SECONDS = 60;

const isTokenRefreshResponse = (data: unknown): data is { access?: string; refresh?: string } => {
  return typeof data === 'object' && data !== null;
};

const decodeJwtPayload = (token: string): Record<string, any> | null => {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
};

const shouldRefreshAccessToken = (token: string | null): boolean => {
  if (!token) return false;
  const payload = decodeJwtPayload(token);
  const exp = typeof payload?.exp === 'number' ? payload.exp : null;
  if (!exp) return false;
  const nowInSeconds = Math.floor(Date.now() / 1000);
  return exp - nowInSeconds <= TOKEN_REFRESH_BUFFER_SECONDS;
};

export const authStore = {
  setSession: (access: string, refresh: string, user: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  setAccessToken: (access: string) => {
    localStorage.setItem(TOKEN_KEY, access);
  },
  setRefreshToken: (refresh: string) => {
    localStorage.setItem(REFRESH_KEY, refresh);
  },
  clearSession: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  },
  getToken: () => localStorage.getItem(TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_KEY),
  getUser: (): AuthUser | null => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  },
  isAuthenticated: () => Boolean(localStorage.getItem(TOKEN_KEY)),
  refreshAccessToken: async (): Promise<string | null> => {
    const refreshToken = localStorage.getItem(REFRESH_KEY);
    if (!refreshToken) return null;

    const res = await fetch(REFRESH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!res.ok) {
      authStore.clearSession();
      return null;
    }

    const data = await res.json().catch(() => null);
    if (!isTokenRefreshResponse(data) || typeof data.access !== 'string' || !data.access) {
      authStore.clearSession();
      return null;
    }

    authStore.setAccessToken(data.access);
    if (typeof data.refresh === 'string' && data.refresh) {
      authStore.setRefreshToken(data.refresh);
    }
    return data.access;
  },
  fetchWithAuth: async (input: RequestInfo | URL, init: RequestInit = {}) => {
    const makeRequest = async (token: string) => {
      const headers = new Headers(init.headers || {});
      headers.set('Authorization', `Bearer ${token}`);
      return fetch(input, { ...init, headers });
    };

    let accessToken = authStore.getToken();
    if (!accessToken) {
      throw new Error('Session expired. Please login again.');
    }

    if (shouldRefreshAccessToken(accessToken)) {
      const refreshedToken = await authStore.refreshAccessToken();
      if (!refreshedToken) {
        throw new Error('Session expired. Please login again.');
      }
      accessToken = refreshedToken;
    }

    let res = await makeRequest(accessToken);
    if (res.status !== 401) return res;

    const newAccessToken = await authStore.refreshAccessToken();
    if (!newAccessToken) {
      throw new Error('Session expired. Please login again.');
    }

    res = await makeRequest(newAccessToken);
    return res;
  },
};
