const configuredUrl = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, '');
const apiUrl = configuredUrl || (import.meta.env.DEV ? 'http://localhost:5000' : '');

export async function authRequest(endpoint, body) {
  if (!apiUrl) {
    throw new Error('Account services are not configured yet. Please contact hello@datarheo.io.');
  }

  let url;
  try {
    url = new URL(apiUrl);
  } catch {
    throw new Error('Account services are not configured correctly. Please contact hello@datarheo.io.');
  }
  if (!['http:', 'https:'].includes(url.protocol) || (import.meta.env.PROD && url.protocol !== 'https:')) {
    throw new Error('Account services require a secure HTTPS connection.');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(`${apiUrl}/api/auth${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const result = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(
        typeof result?.message === 'string'
          ? result.message
          : 'Account services are temporarily unavailable. Please try again.',
      );
    }
    if (!result || typeof result !== 'object') {
      throw new Error('Account services returned an unexpected response. Please try again.');
    }
    return result;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('The request timed out. Please try again.');
    }
    if (error instanceof TypeError) {
      throw new Error('Unable to reach account services. Check your connection and try again.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
