const SERVER_URL = `${import.meta.env.VITE_API_URL}/jsonstore/users`;
const SERVER_URL_ME = `${import.meta.env.VITE_API_URL}/users/me`;

export default async function auth(token) {
    if (token) return fetch(SERVER_URL_ME, { headers: { "X-Authorization": token } }).then(res => res.json());
    return fetch(SERVER_URL).then(res => res.json());
}