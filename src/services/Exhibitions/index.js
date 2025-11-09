import API from "../API";

export async function index(keyword, sort) {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);
        const response = await API.get(`${process.env.VUE_APP_API_URL}/api/exhibitions`, {
            params: { keyword, sort }
        });
        return response.data;
    } catch (error) {
        console.error("Laden der Ausstellungen fehlgeschlagen.", error);
        throw error;
    }
}

export async function show(exhibition_id) {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);
        const response = await API.get(`${process.env.VUE_APP_API_URL}/api/exhibitions/${exhibition_id}`);
        return response.data;
    } catch (error) {
        console.error("Laden der Ausstellung fehlgeschlagen.", error);
        throw error;
    }
}

export async function store(formData) {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);
        const response = await API.post(
            `${process.env.VUE_APP_API_URL}/api/exhibitions`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Speichern der Ausstellung fehlgeschlagen.", error);
        throw error;
    }
}

export async function update(exhibition_id, exhibition_title, exhibition_description, exhibition_image, exhibition_text, exhibition_isActive) {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);

        // IMMER FormData verwenden für Laravel-Kompatibilität
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('title', exhibition_title || '');
        formData.append('description', exhibition_description || '');
        formData.append('text', exhibition_text || '');
        formData.append('isActive', exhibition_isActive ? '1' : '0');

        // Nur wenn neues Bild vorhanden
        if (exhibition_image instanceof File) {
            formData.append('image', exhibition_image);
        }

        const response = await API.post(
            `${process.env.VUE_APP_API_URL}/api/exhibitions/${exhibition_id}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error("Aktualisieren der Ausstellung fehlgeschlagen.", error);
        throw error;
    }
}

export async function destroy(exhibition_id) {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);
        const response = await API.delete(`${process.env.VUE_APP_API_URL}/api/exhibitions/${exhibition_id}`);
        return response.data;
    } catch (error) {
        console.error("Löschen der Ausstellung fehlgeschlagen.", error);
        throw error;
    }
}