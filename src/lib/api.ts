
// Dynamic backend base URL resolution with runtime override support
const DEFAULT_API_BASE = (import.meta as any)?.env?.VITE_API_URL || 'http://localhost:5000';
const LS_API_KEY = 'dsa_api_base_url';

function resolveApiBaseFromUrlParam(): string | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const url = params.get('backend');
    if (url && /^https?:\/\//i.test(url)) return url;
  } catch {}
  return null;
}

export function getApiBaseUrl(): string {
  const param = resolveApiBaseFromUrlParam();
  if (param) return param;
  const fromLS = localStorage.getItem(LS_API_KEY);
  return (fromLS || DEFAULT_API_BASE).replace(/\/$/, '');
}

export function setApiBaseUrl(url: string | null): void {
  if (!url) {
    localStorage.removeItem(LS_API_KEY);
    return;
  }
  try {
    const u = new URL(url);
    localStorage.setItem(LS_API_KEY, `${u.origin}${u.pathname}`.replace(/\/$/, ''));
  } catch {
    // ignore invalid URLs
  }
}

export const API_BASE_URL: string = getApiBaseUrl();

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
  json?: unknown;
}

function buildUrl(path: string, params?: ApiRequestOptions['params']): string {
  const url = new URL(path.replace(/^\//, ''), API_BASE_URL.replace(/\/$/, '/') + '/');
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
}

export async function apiFetch<T = unknown>(
  path: string,
  { method = 'GET', headers, params, json, ...rest }: ApiRequestOptions = {}
): Promise<T> {
  // If base URL override changed at runtime, recompute
  const url = new URL(path.replace(/^\//, ''), getApiBaseUrl().replace(/\/$/, '/') + '/');
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
    });
  }
  
  // Get auth token from localStorage if available
  const token = localStorage.getItem('dsa_auth_token');
  
  const finalHeaders: HeadersInit = {
    'Accept': 'application/json',
    ...(json ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(headers || {}),
  };

  const response = await fetch(url, {
    method: method as HttpMethod,
    headers: finalHeaders,
    body: json !== undefined ? JSON.stringify(json) : rest.body,
    ...rest,
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const error: any = new Error('API request failed');
    error.status = response.status;
    error.statusText = response.statusText;
    error.data = data;
    throw error;
  }

  return data as T;
}

export const api = {
  get: <T = unknown>(path: string, options?: Omit<ApiRequestOptions, 'method' | 'json' | 'body'>) =>
    apiFetch<T>(path, { ...options, method: 'GET' }),
  post: <T = unknown>(path: string, json?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'json'>) =>
    apiFetch<T>(path, { ...options, method: 'POST', json }),
  put: <T = unknown>(path: string, json?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'json'>) =>
    apiFetch<T>(path, { ...options, method: 'PUT', json }),
  patch: <T = unknown>(path: string, json?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'json'>) =>
    apiFetch<T>(path, { ...options, method: 'PATCH', json }),
  delete: <T = unknown>(path: string, options?: Omit<ApiRequestOptions, 'method' | 'json'>) =>
    apiFetch<T>(path, { ...options, method: 'DELETE' }),
};

