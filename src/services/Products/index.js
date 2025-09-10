import API from "../API";

export async function index() {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);

        const response = await API.get(`${process.env.VUE_APP_API_URL}/api/products`);

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
        });

        return response.data;
    } catch (error) {
        console.error("Sepichern des Produkts fehlgeschlagen.", error);
        throw error;
    }
}

export async function update(product_title, product_description, product_image, category_id) {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);

        const response = await API.post(`${process.env.VUE_APP_API_URL}/api/products`, {
            _method: "PUT",
            title: product_title ?? null,
            description: product_description ?? null,
            image: product_image ?? null,
            price: 0.00,
            category_id: category_id ?? null,
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