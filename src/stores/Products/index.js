import { defineStore } from 'pinia';
import { index, show, store, update, destroy } from '@/services/Products';

export const productStore = defineStore('products', {
    state: () => ({
        errors: [],
        products: null,
        singleSelectedProduct: null,
        loading: false,
    }),

    actions: {
        async loadAllProducts() {
            this.loading = true;
            this.errors = [];
            try {
                this.products = await index();
            } catch (error) {
                if (error.response?.status === 422) {
                    this.errors = error.response.data.errors;
                }
            } finally {
                this.loading = false;
            }
        },
        async loadSingleProduct(productId) {
            this.loading = true;
            this.errors = [];
            try {
                this.singleSelectedProduct = await show(productId);
            } catch (error) {
                if (error.response?.status === 422) {
                    this.errors = error.response.data.errors;
                }
            } finally {
                this.loading = false;
            }
        },
        async storeProduct(product_title, product_description, product_image, category_id) {
            this.loading = true;
            this.errors = [];
            try {
                this.products = await store(product_title, product_description, product_image, category_id);
            } catch (error) {
                if (error.response?.status === 422) {
                    this.errors = error.response.data.errors;
                }
            } finally {
                this.loading = false;
            }
        },
        async updateProduct(product_title, product_description, product_image, category_id) {
            this.loading = true;
            this.errors = [];
            try {
                this.products = await update(product_title, product_description, product_image, category_id);
            } catch (error) {
                if (error.response?.status === 422) {
                    this.errors = error.response.data.errors;
                }
            } finally {
                this.loading = false;
            }
        },
        async removeProduct(productId) {
            this.loading = true;
            this.errors = [];
            try {
                this.products = await destroy(productId);
            } catch (error) {
                if (error.response?.status === 422) {
                    this.errors = error.response.data.errors;
                }
            } finally {
                this.loading = false;
            }
        }
    },
});
