import API from "../API";
export async function submit(email, name, message, recaptchaToken) {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);

        const response = await API.post(`${process.env.VUE_APP_API_URL}/api/contact`, {
            email,
            name,
            message,
            recaptcha_token: recaptchaToken
        });

        return response.data;
    } catch (error) {
        console.error("Senden der Kontaktanfrage fehlgeschlagen!", error);
        throw error;
    }
}