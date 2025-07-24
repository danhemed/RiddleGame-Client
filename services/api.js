const BASE_URL = 'http://localhost:3005'

export const api = {
    async getFetch(path) {
        const res = await fetch(`${BASE_URL}/${path}`);
        return await res.json();
    },

    async postFetch(data, path) {
        try {
            const res = await fetch(`${BASE_URL}/${path}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
            return await res.json();
        } catch (err) {
            console.log(err.message);
        }
    },

    async putFetch(id, data, path) {
        try {
            const res = await fetch(`${BASE_URL}/${path}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
            console.log(res);
            return await res.json();
        } catch (err) {
            console.log(err.message);
        }
    },

    async deleteFetch(id, path) {
        try {
            const res = await fetch(`${BASE_URL}/${path}/${id}`, {
                method: "DELETE",
            })
            return await res.json({ message: "The deletion was successful" });
        } catch (err) {
            console.log(err.message);
        }
    },
}


