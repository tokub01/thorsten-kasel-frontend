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

export async function show(category_id){
    try{
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);
        const response = await API.get(`${process.env.VUE_APP_API_URL}/api/categories/${category_id}`);
        return response.data;
    }catch(error){
        console.error("Laden der Kategorie fehlgeschlagen", error);
        throw error;
    }
}

export async function store(category_name){
    try{
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);
        const response = await API.post(`${process.env.VUE_APP_API_URL}/api/categories`, {
            name: category_name,
        }, );
        return response.data;
    }catch(error){
        console.error("Speichern der Kategorie fehlgeschlagen", error);
        throw error;
    }
}

export async function update(product_id, category_id, category_name){
    try{
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);
        const response = await API.post(`${process.env.VUE_APP_API_URL}/api/categories/${category_id}`, {
            _method: "PUT",
            product_id: product_id,
            name: category_name,
        });
        return response.data.data;
    }catch(error){
        console.error("Aktualisieren der Kategorie fehlgeschlagen", error);
        throw error;
    }
}

export async function destroy(category_id){
    try{
        await API.get(`${process.env.VUE_APP_API_URL}/sanctum/csrf-cookie`);
        const response = await API.post(`${process.env.VUE_APP_API_URL}/api/categories/${category_id}`, {
            _method: "DELETE",
        });
        return response.data;
    }catch(error){
        console.error("Löschen der Kategorie fehlgeschlagen", error);
        throw error;
    }
}
