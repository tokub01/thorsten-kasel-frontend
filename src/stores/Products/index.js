import { defineStore } from 'pinia';
import * as ProductService from '@/services/Products';

export const useProductStore = defineStore('products', {
    state: () => ({
        errors: [],
        products: null,
        singleSelectedProduct: null,
        loading: false,
        error: null,
    }),

    getters: {
        allProducts: (state) => {
            return state.products?.data || [];
        },

        activeProducts: (state) => {
            const products = state.products?.data || [];
            return products.filter(p => p.isActive === 1 || p.isActive === '1' || p.isActive === true);
        },

        totalCount: (state) => {
            return state.products?.data?.length || 0;
        },
    },

    actions: {
        async loadAllProducts(keyword = '', category = '', sort = 'desc') {
            this.loading = true;
            this.errors = [];
            this.error = null;

            try {
                this.products = await ProductService.index(keyword, category, sort);
            } catch (error) {
                console.error('Error loading products:', error);
                this.error = error;
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
            this.error = null;

            try {
                this.singleSelectedProduct = await ProductService.show(productId);
                return this.singleSelectedProduct;
            } catch (error) {
                console.error('Error loading product:', error);
                this.error = error;
                if (error.response?.status === 422) {
                    this.errors = error.response.data.errors;
                }
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async storeProduct(formData) {
            this.loading = true;
            this.errors = [];
            this.error = null;

            try {
                const newProduct = await ProductService.store(formData);

                // Produkt zur Liste hinzufügen
                if (this.products?.data) {
                    this.products.data.unshift(newProduct);
                }

                return newProduct;
            } catch (error) {
                console.error('Error storing product:', error);
                this.error = error;
                if (error.response?.status === 422) {
                    this.errors = error.response.data.errors;
                }
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateProduct(product_id, formData) {
            this.loading = true;
            this.errors = [];
            this.error = null;

            try {
                const updatedProduct = await ProductService.update(product_id, formData);

                // Produkt in Liste aktualisieren
                if (this.products?.data) {
                    const index = this.products.data.findIndex(p => p.id === product_id);
                    if (index !== -1) {
                        this.products.data.splice(index, 1, updatedProduct);
                    }
                }

                // Single product aktualisieren
                if (this.singleSelectedProduct?.id === product_id) {
                    this.singleSelectedProduct = updatedProduct;
                }

                return updatedProduct;
            } catch (error) {
                console.error('Error updating product:', error);
                this.error = error;
                if (error.response?.status === 422) {
                    this.errors = error.response.data.errors;
                }
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async removeProduct(productId) {
            this.loading = true;
            this.errors = [];
            this.error = null;

            try {
                await ProductService.destroy(productId);

                // Aus Liste entfernen
                if (this.products?.data) {
                    this.products.data = this.products.data.filter(p => p.id !== productId);
                }

                // Single product zurücksetzen
                if (this.singleSelectedProduct?.id === productId) {
                    this.singleSelectedProduct = null;
                }

                return true;
            } catch (error) {
                console.error('Error deleting product:', error);
                this.error = error;
                if (error.response?.status === 422) {
                    this.errors = error.response.data.errors;
                }
                throw error;
            } finally {
                this.loading = false;
            }
        }
    },
});