import API from "../API";

export async function index(keyword, category, sort) {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);

        const response = await API.get(`${process.env.VUE_APP_API_URL}/api/products?keyword=${keyword}&category=${category}&sort=${sort}`);

        return response.data;
    } catch (error) {
        console.error("Laden der Produkte fehlgeschlagen.", error);
        throw error;
    }
}

export async function show(product_id) {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);

        const response = await API.get(`${process.env.VUE_APP_API_URL}/api/products/${product_id}`);

        return response.data;
    } catch (error) {
        console.error("Laden der Produkte fehlgeschlagen.", error);
        throw error;
    }
}

export async function store(formData) {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);

        const response = await API.post(`${process.env.VUE_APP_API_URL}/api/products`, {
            'title': formData.get('title'),
            'description':formData.get('description'),
            'image': formData.get('image'),
            'price': 0.00,
            'category_id': formData.get('category_id'),
            'isActive': formData.get('isActive'),
        });

        return response.data;
    } catch (error) {
        console.error("Sepichern des Produkts fehlgeschlagen.", error);
        throw error;
    }
}

export async function update(product_id, formData) {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);

        const response = await API.post(`${process.env.VUE_APP_API_URL}/api/products/${product_id}`, {
            _method: "PUT",
                'title': formData.get('title'),
                'description':formData.get('description'),
                'image': formData.get('image'),
                'price': 0.00,
                'category_id': formData.get('category_id'),
                'isActive': formData.get('isActive'),
        });

        return response.data;
    } catch (error) {
        console.error("Aktualisieren des Produkts fehlgeschlagen.", error);
        throw error;
    }
}

export async function destroy(product_id) {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);

        const response = await API.post(`${process.env.VUE_APP_API_URL}/api/products/${product_id}`, {
            _method: "DELETE",
        });

        return response.data;
    } catch (error) {
        console.error("Löschen des Produkts fehlgeschlagen.", error);
        throw error;
    }
}