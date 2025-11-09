import API from "../API";

export async function index(keyword = '', sort = 'desc') {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);
        const response = await API.get(`${process.env.VUE_APP_API_URL}/api/news`, {
            params: { keyword, sort }
        });
        return response.data;
    } catch (error) {
        console.error("Laden der News fehlgeschlagen.", error);
        throw error;
    }
}

export async function show(news_id) {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);
        const response = await API.get(`${process.env.VUE_APP_API_URL}/api/news/${news_id}`);
        return response.data;
    } catch (error) {
        console.error("Laden des News Artikels fehlgeschlagen.", error);
        throw error;
    }
}

export async function store(formData) {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);

        // ✅ FormData direkt senden, nicht die Werte einzeln extrahieren
        const response = await API.post(
            `${process.env.VUE_APP_API_URL}/api/news`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Speichern des News Artikels fehlgeschlagen.", error);
        throw error;
    }
}

export async function update(news_id, news_title, news_description, news_image, news_text, news_isActive) {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);

        // ✅ IMMER FormData für Konsistenz
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('title', news_title || '');
        formData.append('description', news_description || '');
        formData.append('text', news_text || '');
        formData.append('isActive', news_isActive ? '1' : '0');

        // Nur wenn neues Bild vorhanden
        if (news_image instanceof File) {
            formData.append('image', news_image);
        }

        const response = await API.post(
            `${process.env.VUE_APP_API_URL}/api/news/${news_id}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Aktualisieren des Artikels fehlgeschlagen.", error);
        throw error;
    }
}

export async function destroy(news_id) {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);
        const response = await API.delete(`${process.env.VUE_APP_API_URL}/api/news/${news_id}`);
        return response.data;
    } catch (error) {
        console.error("Löschen des Artikels fehlgeschlagen.", error);
        throw error;
    }
}