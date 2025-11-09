import API from "../API";

export async function index(keyword = '', category = '', sort = 'desc') {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);
        const response = await API.get(`${process.env.VUE_APP_API_URL}/api/products`, {
            params: { keyword, category, sort }
        });
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
        console.error("Laden des Produkts fehlgeschlagen.", error);
        throw error;
    }
}

export async function store(formData) {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);

        // ✅ FormData direkt senden
        const response = await API.post(
            `${process.env.VUE_APP_API_URL}/api/products`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Speichern des Produkts fehlgeschlagen.", error);
        throw error;
    }
}

export async function update(product_id, formData) {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);

        // ✅ FormData mit _method=PUT
        const fd = new FormData();
        fd.append('_method', 'PUT');

        // Alle Felder von formData übertragen
        for (let [key, value] of formData.entries()) {
            fd.append(key, value);
        }

        const response = await API.post(
            `${process.env.VUE_APP_API_URL}/api/products/${product_id}`,
            fd,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Aktualisieren des Produkts fehlgeschlagen.", error);
        throw error;
    }
}

export async function destroy(product_id) {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);
        const response = await API.delete(`${process.env.VUE_APP_API_URL}/api/products/${product_id}`);
        return response.data;
    } catch (error) {
        console.error("Löschen des Produkts fehlgeschlagen.", error);
        throw error;
    }
}