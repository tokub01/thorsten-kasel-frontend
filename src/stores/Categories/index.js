import { defineStore } from 'pinia';
import * as CategoryService from '@/services/Categories';

export const useCategoryStore = defineStore('categories', {
    state: () => ({
        errors: [],
        categories: [],
        singleSelectedCategory: null,
        loading: false,
        error: null,
    }),

    getters: {
        allCategories: (state) => {
            return Array.isArray(state.categories) ? state.categories : [];
        },

        totalCount: (state) => {
            return Array.isArray(state.categories) ? state.categories.length : 0;
        },

        getCategoryById: (state) => {
            return (id) => {
                const cats = Array.isArray(state.categories) ? state.categories : [];
                return cats.find(c => c.id === id);
            };
        },
    },

    actions: {
        async loadAllCategories() {
            this.loading = true;
            this.errors = [];
            this.error = null;

            try {
                const data = await CategoryService.index();
                this.categories = Array.isArray(data) ? data : [];

                console.log('📦 Loaded categories:', this.categories.length);
            } catch (error) {
                console.error('Error loading categories:', error);
                this.error = error;
                this.categories = [];

                if (error.response?.status === 422) {
                    this.errors = error.response.data.errors;
                }
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async loadSingleCategory(categoryId) {
            this.loading = true;
            this.errors = [];
            this.error = null;

            try {
                this.singleSelectedCategory = await CategoryService.show(categoryId);
                return this.singleSelectedCategory;
            } catch (error) {
                console.error('Error loading category:', error);
                this.error = error;
                this.singleSelectedCategory = null;

                if (error.response?.status === 422) {
                    this.errors = error.response.data.errors;
                }
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async storeCategory(categoryName, productId = null) {
            this.loading = true;
            this.errors = [];
            this.error = null;

            console.log('🏪 Store storeCategory called with:', {
                categoryName,
                productId
            });

            try {
                const newCategory = await CategoryService.store(categoryName, productId);

                console.log('✅ Store response:', newCategory);

                // Extrahiere data wenn vorhanden
                const categoryData = newCategory.data || newCategory;

                // Zur Liste hinzufügen
                if (Array.isArray(this.categories)) {
                    this.categories.unshift(categoryData);
                }

                return newCategory;
            } catch (error) {
                console.error('❌ Error storing category:', error);
                this.error = error;

                if (error.response?.status === 422) {
                    this.errors = error.response.data.errors;
                }
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateCategory(categoryId, categoryName, productId = null) {
            this.loading = true;
            this.errors = [];
            this.error = null;

            console.log('🏪 Store updateCategory called with:', {
                categoryId,
                categoryName,
                productId,
                categoryIdType: typeof categoryId,
                productIdType: typeof productId
            });

            try {
                // Hole die aktuelle Kategorie
                const currentCategory = this.categories.find(c => c.id === categoryId);

                if (currentCategory) {
                    console.log('📊 Current category state:', {
                        id: currentCategory.id,
                        name: currentCategory.name,
                        product_id: currentCategory.product_id
                    });
                }

                // Rufe Service mit korrekten Parametern auf
                const updatedCategory = await CategoryService.update(
                    categoryId,      // category_id
                    categoryName,    // category_name
                    productId        // product_id (kann null sein)
                );

                console.log('✅ Update response:', updatedCategory);

                // Extrahiere data wenn vorhanden
                const categoryData = updatedCategory.data || updatedCategory;

                // In Liste aktualisieren
                if (Array.isArray(this.categories)) {
                    const index = this.categories.findIndex(c => c.id === categoryId);
                    if (index !== -1) {
                        // Komplettes Object ersetzen
                        this.categories.splice(index, 1, categoryData);
                        console.log('✅ Category updated in store at index:', index);
                    } else {
                        console.warn('⚠️ Category not found in store, will reload');
                        // Fallback: Neu laden
                        await this.loadAllCategories();
                    }
                }

                // Single category aktualisieren
                if (this.singleSelectedCategory?.id === categoryId) {
                    this.singleSelectedCategory = categoryData;
                }

                return updatedCategory;
            } catch (error) {
                console.error('❌ Error updating category:', error);
                console.error('❌ Error details:', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    message: error.message
                });

                this.error = error;

                if (error.response?.status === 422) {
                    this.errors = error.response.data.errors;

                    // Zeige spezifische Validierungsfehler
                    console.error('❌ Validation errors:', this.errors);
                }

                throw error;
            } finally {
                this.loading = false;
            }
        },

        async removeCategory(categoryId) {
            this.loading = true;
            this.errors = [];
            this.error = null;

            try {
                await CategoryService.destroy(categoryId);

                // Aus Liste entfernen
                if (Array.isArray(this.categories)) {
                    this.categories = this.categories.filter(c => c.id !== categoryId);
                }

                // Single category zurücksetzen
                if (this.singleSelectedCategory?.id === categoryId) {
                    this.singleSelectedCategory = null;
                }

                return true;
            } catch (error) {
                console.error('Error deleting category:', error);
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