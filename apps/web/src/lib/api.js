const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
export async function api(path, init) {
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: { 'Content-Type': 'application/json', ...init?.headers },
        ...init
    });
    if (!res.ok)
        throw new Error(`API error: ${res.status}`);
    return res.json();
}
