// utils/requester.js

export class ApiError extends Error {
    constructor(message, status = 0, body = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.body = body;
    }
}

// --- Конфигурируеми зависимости (за да няма циклични import-и) ---
let getToken = () => sessionStorage.getItem('token');
let onUnauthorized = null;

export const setTokenGetter = (fn) => { getToken = fn; };
export const setUnauthorizedHandler = (fn) => { onUnauthorized = fn; };

// --- Основна функция ---
async function request(method, url, data, options = {}) {
    const { signal, headers: customHeaders, ...rest } = options;

    const headers = { ...customHeaders };
    let body;

    // body само за методи, които го поддържат
    if (data !== undefined && data !== null && method !== 'GET' && method !== 'DELETE') {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(data);
    }

    // Автоматичен Bearer token (ако има)
    const token = getToken();
    if (token && !headers['Authorization']) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    let response;
    try {
        response = await fetch(url, {
            method,
            headers,
            body,
            signal,
            credentials: 'include', // за httpOnly cookie
            ...rest,
        });
    } catch (err) {
        if (err.name === 'AbortError') throw err;
        throw new ApiError('Network error', 0, null);
    }

    // 401 → централизиран logout
    if (response.status === 401) {
        onUnauthorized?.();
        throw new ApiError('Unauthorized', 401, null);
    }

    // Парсване на тялото
    let payload = null;
    const contentType = response.headers.get('Content-Type') || '';
    if (response.status !== 204) {
        if (contentType.includes('application/json')) {
            payload = await response.json().catch(() => null);
        } else {
            payload = await response.text();
        }
    }

    if (!response.ok) {
        throw new ApiError(
            payload?.message || `HTTP ${response.status}`,
            response.status,
            payload
        );
    }

    return payload;
}

export default {
    get: (url, options) => request('GET', url, undefined, options),
    post: (url, data, options) => request('POST', url, data, options),
    put: (url, data, options) => request('PUT', url, data, options),
    patch: (url, data, options) => request('PATCH', url, data, options),
    delete: (url, options) => request('DELETE', url, undefined, options),
    baseRequest: request,
};