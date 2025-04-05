async function request(method, url, data, options = {}) {
    if (method !== 'GET') options.method = method;

    if (data) {
        options = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            body: JSON.stringify(data),
        }
    }

    const response = await fetch(url, options);
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const responseContentType = response.headers.get('Content-Type');

    if (!responseContentType) return;

    return response.json();
};

export default {
    get: request.bind(null, 'GET'),
    // get: (...params) => request('GET', ...params)
    post: request.bind(null, 'POST'),
    put: request.bind(null, 'PUT'),
    delete: request.bind(null, 'DELETE'),
    baseRequest: request,
}
