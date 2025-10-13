import API from "../API";

export async function index(keyword, sort) {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);

        const response = await API.get(`${process.env.VUE_APP_API_URL}/api/exhibitions?keyword=${keyword}&sort=${sort}`);

        return response.data;
    } catch (error) {
        console.error("Laden der Austellung fehlgeschlagen.", error);
        throw error;
    }
}

export async function show(news_id) {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);

        const response = await API.get(`${process.env.VUE_APP_API_URL}/api/exhibitions/${news_id}`);

        return response.data;
    } catch (error) {
        console.error("Laden des Austellung Artikels fehlgeschlagen.", error);
        throw error;
    }
}

export async function store(formData) {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);

        const response = await API.post(`${process.env.VUE_APP_API_URL}/api/exhibitions`, {
            'title': formData.get('title'),
            'description':formData.get('description'),
            'image': formData.get('image'),
            'text': formData.get('text'),
        });

        return response.data;
    } catch (error) {
        console.error("Speichern des Austellung Artikels fehlgeschlagen.", error);
        throw error;
    }
}

export async function update(exhibition_title, exhibition_description, exhibition_image, exhibition_text) {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);

        const response = await API.post(`${process.env.VUE_APP_API_URL}/api/exhibitions`, {
            _method: "PUT",
            title: exhibition_title ?? null,
            description: exhibition_description ?? null,
            image: exhibition_image ?? null,
            text: exhibition_text ?? null,
        });

        return response.data;
    } catch (error) {
        console.error("Aktualisieren des Artikels fehlgeschlagen.", error);
        throw error;
    }
}

export async function destroy(news_id) {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);

        const response = await API.post(`${process.env.VUE_APP_API_URL}/api/news/${news_id}`, {
            _method: "DELETE",
        });

        return response.data;
    } catch (error) {
        console.error("Löschen des Artikels fehlgeschlagen.", error);
        throw error;
    }
}