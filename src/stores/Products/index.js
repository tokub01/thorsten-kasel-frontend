import { defineStore } from 'pinia';
import { index, show, store, update, destroy } from '@/services/Products';

export const useProductStore = defineStore('products', {
    state: () => ({
        errors: [],
        products: null,
        singleSelectedProduct: null,
        loading: false,
    }),

    actions: {
        async loadAllProducts(keyword, category, sort) {
            this.loading = true;
            this.errors = [];
            try {
                this.products = await index(keyword, category, sort);
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
        async storeProduct(formData) {
            this.loading = true;
            this.errors = [];
            try {
                this.products = await store(formData);
            } catch (error) {
                if (error.response?.status === 422) {
                    this.errors = error.response.data.errors;
                }
            } finally {
                this.loading = false;
            }
        },
        async updateProduct(product_id, formData) {
            this.loading = true;
            this.errors = [];
            try {
                this.products = await update(product_id, formData);
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
