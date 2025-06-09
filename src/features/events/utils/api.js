const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

/**
 * General API request function
 * @param {string} path - The API path, e.g. '/api/v1/events'
 * @param {object} options - fetch options (method, headers, body, etc.)
 * @returns {Promise<any>}
 */

export async function apiRequest(path, options = {}, user = null) {
  let headers = options.headers || {};
  if(user && user.authorizationHeaders){
    console.log('Authorization header:', user.authorizationHeaders());
    headers = { ...headers, ...user.authorizationHeaders()} ;
  }
  try {
    const res = await fetch(`${apiUrl}${path}`, {...options, headers });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.error(`API request to ${path} failed`, err);
    throw err;
  }
}