import API from "../API";
export async function login(email, password) {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);

        const response = await API.post(`${process.env.VUE_APP_API_URL}/api/auth/login`, {
            email,
            password,
        });

        return response.data;
    } catch (error) {
        console.error("Login fehlgeschlagen:", error);
        throw error;
    }
}

export async function register(email, name, password, password_confirmation) {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);

        const response = await API.post(`${process.env.VUE_APP_API_URL}/api/auth/register`, {
            email,
            name,
            password,
            password_confirmation,
        });

        return response.data;
    } catch (error) {
        console.error("Login fehlgeschlagen:", error);
        throw error;
    }
}

export async function logout() {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);

        const response = await API.post(
            `${process.env.VUE_APP_API_URL}/api/auth/logout`, {},{headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
                }}
        );

        return response.data;
    } catch (error) {
        console.error("Logout fehlgeschlagen:", error);
        throw error;
    }
}