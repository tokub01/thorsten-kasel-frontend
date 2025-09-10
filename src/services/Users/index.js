import API from "./API";

export async function index() {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);

        const response = await API.get(`${process.env.VUE_APP_API_URL}/api/users`);

        return response.data;
    } catch (error) {
        console.error("Laden der Benutzer fehlgeschlagen.", error);
        throw error;
    }
}

export async function show(user_id) {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);

        const response = await API.get(`${process.env.VUE_APP_API_URL}/api/users/${user_id}`);

        return response.data;
    } catch (error) {
        console.error("Laden der Benutzer fehlgeschlagen.", error);
        throw error;
    }
}

export async function store(user_name, user_email, user_password, user_password_confirmation, user_biography) {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);

        const response = await API.post(`${process.env.VUE_APP_API_URL}/api/users`, {
            email: user_email,
            name: user_name,
            password:user_password,
            password_confirmation:user_password_confirmation,
            biography: user_biography,
        });

        return response.data;
    } catch (error) {
        console.error("Laden der Benutzer fehlgeschlagen.", error);
        throw error;
    }
}

export async function update(user_name, user_email, user_password, user_password_confirmation, user_biography) {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);

        const response = await API.post(`${process.env.VUE_APP_API_URL}/api/users`, {
            _method: "PUT",
            email: user_email ?? null,
            name: user_name ?? null,
            password:user_password ?? null,
            password_confirmation:user_password_confirmation ?? null,
            biography: user_biography ?? null,
        });

        return response.data;
    } catch (error) {
        console.error("Laden der Benutzer fehlgeschlagen.", error);
        throw error;
    }
}

export async function destroy(user_id) {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);

        const response = await API.post(`${process.env.VUE_APP_API_URL}/api/users/${user_id}`, {
            _method: "DELETE",
        });

        return response.data;
    } catch (error) {
        console.error("Laden der Benutzer fehlgeschlagen.", error);
        throw error;
    }
}