const localApiUrl = 'http://localhost:5000';
const productionApiUrl = 'https://api.datarheo.io';

export const API_URL = (() => {
  const configuredUrl = import.meta.env.VITE_API_URL?.trim();

  if (configuredUrl) {
    return configuredUrl.replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined') {
    const { hostname, port } = window.location;
    const normalizedHost = hostname.toLowerCase();

    if (normalizedHost === 'localhost' || normalizedHost === '127.0.0.1') {
      return localApiUrl;
    }

    if (normalizedHost.includes('datarheo.io')) {
      return productionApiUrl;
    }

    return `${window.location.protocol}//${hostname}${port ? `:${port}` : ''}`;
  }

  return productionApiUrl;
})();

export function apiFetch(path, options) {
  return fetch(`${API_URL}${path}`, {
    ...options,
    credentials: options?.credentials || 'include',
  });
}
