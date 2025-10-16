import API from "../API";

// GET /api/users
export async function index(keyword = "", sort = "") {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);

        const response = await API.get(`${process.env.VUE_APP_API_URL}/api/users?keyword=${keyword}&sort=${sort}`);

        return response.data;
    } catch (error) {
        console.error("Laden der Benutzer fehlgeschlagen.", error);
        throw error;
    }
}

// GET /api/users/:id
export async function show(user_id) {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);

        const response = await API.get(`${process.env.VUE_APP_API_URL}/api/users/${user_id}`);

        return response.data;
    } catch (error) {
        console.error("Laden des Benutzers fehlgeschlagen.", error);
        throw error;
    }
}

// GET /api/users/:id/biography
export async function getBiography(user_id) {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);

        const response = await API.get(`${process.env.VUE_APP_API_URL}/api/users/${user_id}/biography`);

        return response.data;
    } catch (error) {
        console.error("Laden der Biografie fehlgeschlagen.", error);
        throw error;
    }
}

// POST /api/users
export async function store(formData) {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);

        const response = await API.post(`${process.env.VUE_APP_API_URL}/api/users`, {
            email: formData.get('email'),
            name: formData.get('name'),
            password: formData.get('password'),
            password_confirmation: formData.get('password_confirmation'),
            biography: formData.get('biography') ?? null,
        });

        return response.data;
    } catch (error) {
        console.error("Speichern des Benutzers fehlgeschlagen.", error);
        throw error;
    }
}

// PUT /api/users/:id
export async function update(userId, email, name, password = null, biography = null) {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);

        const payload = {
            _method: "PUT",
            email: email ?? null,
            name: name ?? null,
            biography : biography ?? null,
        };

        if (password) {
            payload.password = password;
            payload.password_confirmation = password;
        }



        const response = await API.post(`${process.env.VUE_APP_API_URL}/api/users/${userId}`, payload);

        return response.data;
    } catch (error) {
        console.error("Aktualisieren des Benutzers fehlgeschlagen.", error);
        throw error;
    }
}

// DELETE /api/users/:id
export async function destroy(user_id) {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);

        const response = await API.delete(`${process.env.VUE_APP_API_URL}/api/users/${user_id}`);

        return response.data;
    } catch (error) {
        console.error("Löschen des Benutzers fehlgeschlagen.", error);
        throw error;
    }
}
