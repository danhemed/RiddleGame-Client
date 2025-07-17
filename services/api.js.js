const BASE_URL = 'http://localhost:3005'

export const api = {
    async getFetch(path) {
        const res = await fetch(`${BASE_URL}/${path}`);
        return await res.json();
    },

    async createFetch(data, path) {
        const res = await fetch(`${BASE_URL}/${path}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
        return await res.json();
    },

    async updateFetch(id, data, path) {
        const res = await fetch(`${BASE_URL}/${path}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
        return await res.json();
    },

    async deleteFetch(id, path) {
        const res = await fetch(`${BASE_URL}/${path}/${id}`, {
            method: "DELETE",
        })
        return await res.json();
    },
} 


