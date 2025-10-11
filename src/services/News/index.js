import API from "../API";

export async function index(keyword, sort) {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);

        const response = await API.get(`${process.env.VUE_APP_API_URL}/api/news?keyword=${keyword}&sort=${sort}`);

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

        const response = await API.post(`${process.env.VUE_APP_API_URL}/api/news`, {
            'title': formData.get('title'),
            'description':formData.get('description'),
            'image': formData.get('image'),
            'text': formData.get('text'),
        });

        return response.data;
    } catch (error) {
        console.error("Sepichern des News Artikels fehlgeschlagen.", error);
        throw error;
    }
}

export async function update(news_title, news_description, news_image, news_text) {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);

        const response = await API.post(`${process.env.VUE_APP_API_URL}/api/news`, {
            _method: "PUT",
            title: news_title ?? null,
            description: news_description ?? null,
            image: news_image ?? null,
            text: news_text ?? null,
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