import API from "../API";

export async function index() {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);
        const response = await API.get(`${process.env.VUE_APP_API_URL}/api/categories`);
        return response.data.data;
    } catch (error) {
        console.error("Laden der Kategorien fehlgeschlagen.", error);
        throw error;
    }
}

export async function show(category_id) {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);
        const response = await API.get(`${process.env.VUE_APP_API_URL}/api/categories/${category_id}`);
        return response.data;
    } catch (error) {
        console.error("Laden der Kategorie fehlgeschlagen", error);
        throw error;
    }
}

export async function store(category_name, product_id = null) {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);

        const payload = {
            name: category_name
        };

        if (product_id !== null && product_id !== undefined) {
            payload.product_id = product_id;
        }

        console.log('📤 Store payload:', payload);

        const response = await API.post(
            `${process.env.VUE_APP_API_URL}/api/categories`,
            payload
        );

        return response.data;
    } catch (error) {
        console.error("Speichern der Kategorie fehlgeschlagen", error);
        console.error("Response data:", error.response?.data);
        throw error;
    }
}

export async function update(category_id, category_name, product_id = null) {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);

        // Laravel benötigt _method: "PUT" mit POST für Formulare
        const payload = {
            _method: "PUT",
            name: category_name  // Name ist IMMER erforderlich
        };

        // product_id hinzufügen wenn vorhanden
        // null = Produkt entfernen, undefined = nicht ändern
        if (product_id !== undefined) {
            payload.product_id = product_id;
        }

        console.log('📤 Update payload:', {
            category_id,
            payload
        });

        // Verwende POST mit _method="PUT" für Laravel
        const response = await API.post(
            `${process.env.VUE_APP_API_URL}/api/categories/${category_id}`,
            payload
        );

        console.log('✅ Update response:', response.data);

        return response.data;
    } catch (error) {
        console.error("Aktualisieren der Kategorie fehlgeschlagen", error);
        console.error("Response data:", error.response?.data);
        console.error("Request payload was:", {
            category_id,
            category_name,
            product_id
        });
        throw error;
    }
}

export async function destroy(category_id) {
    try {
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);
        const response = await API.delete(`${process.env.VUE_APP_API_URL}/api/categories/${category_id}`);
        return response.data;
    } catch (error) {
        console.error("Löschen der Kategorie fehlgeschlagen", error);
        throw error;
    }
}