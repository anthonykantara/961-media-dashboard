const configuredKey = (import.meta as any).env?.VITE_AUTH_TOKEN_STORAGE_KEY?.trim();

const DEFAULT_KEYS = ['authToken', 'token', 'accessToken', 'access_token', 'jwt'];

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;

  const storageKeys = configuredKey ? [configuredKey] : DEFAULT_KEYS;
  for (const key of storageKeys) {
    const token = window.localStorage.getItem(key) || window.sessionStorage.getItem(key);
    if (token) return token;
  }

  return null;
}

export function authHeaders(): Record<string, string> {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function requireAuthToken(): string {
  const token = getAuthToken();
  if (!token) {
    throw new Error(
      configuredKey
        ? `No authentication token found in storage key "${configuredKey}".`
        : 'No authentication token found. Configure VITE_AUTH_TOKEN_STORAGE_KEY or provide a supported browser auth token.'
    );
  }
  return token;
}
