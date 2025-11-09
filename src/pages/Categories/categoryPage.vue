<template>
  <div class="bg-gray-300 p-4 md:p-8 min-h-screen">
    <div class="max-w-7xl mx-auto">

      <!-- Header -->
      <div class="mb-8">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 class="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2 flex items-center gap-3">
              <div class="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg">
                <Tag class="w-8 h-8 text-white" />
              </div>
              Kategorien
            </h1>
            <p class="text-gray-600">Verwalte deine Produkt-Kategorien</p>
          </div>
          <button
            @click="openCreateModal"
            class="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-xl transition-all flex items-center justify-center gap-2 font-semibold shadow-lg"
          >
            <Plus class="w-5 h-5" />
            <span>Neue Kategorie</span>
          </button>
        </div>

        <!-- Stats Card -->
        <div class="bg-white rounded-2xl shadow-md p-4 md:p-6 border border-gray-100">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl">
              <p class="text-2xl md:text-3xl font-bold text-indigo-600">{{ categories.length }}</p>
              <p class="text-xs md:text-sm text-gray-600 font-medium mt-1">Kategorien</p>
            </div>
            <div class="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <p class="text-2xl md:text-3xl font-bold text-blue-600">{{ allProducts.length }}</p>
              <p class="text-xs md:text-sm text-gray-600 font-medium mt-1">Produkte</p>
            </div>
            <div class="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <p class="text-2xl md:text-3xl font-bold text-purple-600">{{ categoriesWithImages }}</p>
              <p class="text-xs md:text-sm text-gray-600 font-medium mt-1">Mit Bildern</p>
            </div>
            <div class="text-center p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl">
              <p class="text-2xl md:text-3xl font-bold text-pink-600">{{ categoriesWithProducts }}</p>
              <p class="text-xs md:text-sm text-gray-600 font-medium mt-1">Verknüpft</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Card -->
      <div class="bg-white shadow-md rounded-2xl border border-gray-100 overflow-hidden">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
          <div class="relative">
            <Loader2 class="w-16 h-16 text-indigo-600 animate-spin" />
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-12 h-12 bg-indigo-100 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p class="text-gray-600 font-semibold mt-6 text-lg">Lädt Kategorien...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-20 px-4">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle class="w-8 h-8 text-red-600" />
          </div>
          <p class="text-red-600 font-semibold text-lg mb-2">{{ error }}</p>
          <button @click="loadData" class="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-semibold">
            Erneut versuchen
          </button>
        </div>

        <!-- Desktop Table -->
        <div v-else class="hidden md:block overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Bild
                </th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Kategorie
                </th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Verknüpftes Produkt
                </th>
                <th scope="col" class="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="(category, index) in categories"
                :key="category.id"
                class="hover:bg-gray-50 transition-colors"
                :style="`animation: fadeInUp 0.3s ease-out ${index * 0.05}s both`"
              >
                <!-- Bild -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <SafeImage
                    :src="getCategoryImage(category)"
                    :alt="category.name"
                    icon-class="w-6 h-6 text-gray-400"
                    class="h-16 w-16 rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm"
                  />
                </td>

                <!-- Kategorie Name -->
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg">
                      <Tag class="w-4 h-4 text-indigo-600" />
                    </div>
                    <span class="font-bold text-gray-900 text-lg">{{ category.name }}</span>
                  </div>
                </td>

                <!-- Produkt Info -->
                <td class="px-6 py-4">
                  <div v-if="getProductInfo(category)" class="flex items-center gap-3">
                    <SafeImage
                      :src="getProductInfo(category).image"
                      :alt="getProductInfo(category).title"
                      :fallback-icon="Package"
                      icon-class="w-4 h-4 text-gray-400"
                      class="h-10 w-10 rounded-lg overflow-hidden border border-gray-200"
                    />
                    <div class="min-w-0">
                      <p class="text-sm font-bold text-gray-900 truncate">
                        {{ getProductInfo(category).title }}
                      </p>
                      <p class="text-xs text-gray-500">ID: {{ getProductInfo(category).id }}</p>
                    </div>
                  </div>
                  <span v-else class="text-sm text-gray-400 italic">Nicht verknüpft</span>
                </td>

                <!-- Aktionen -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex justify-center gap-2">
                    <button
                      @click="openEditModal(category)"
                      class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all text-sm font-semibold shadow-sm hover:shadow-md"
                    >
                      <Edit2 class="w-4 h-4" />
                      Bearbeiten
                    </button>
                    <button
                      @click="handleDelete(category)"
                      :disabled="deletingIds.has(category.id)"
                      class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-50 to-red-100 text-red-600 rounded-xl hover:from-red-100 hover:to-red-200 transition-all text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                    >
                      <Loader2 v-if="deletingIds.has(category.id)" class="w-4 h-4 animate-spin" />
                      <Trash2 v-else class="w-4 h-4" />
                      Löschen
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-if="categories.length === 0">
                <td colspan="4" class="text-center py-20">
                  <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Tag class="w-10 h-10 text-gray-400" />
                  </div>
                  <p class="text-gray-500 text-xl font-semibold mb-2">Noch keine Kategorien vorhanden</p>
                  <p class="text-gray-400 text-sm mb-6">Erstelle deine erste Kategorie mit dem Button oben</p>
                  <button
                    @click="openCreateModal"
                    class="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-xl transition-all font-semibold"
                  >
                    <Plus class="w-5 h-5" />
                    Erste Kategorie erstellen
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards -->
        <div v-if="!isLoading && !error" class="md:hidden divide-y divide-gray-200">
          <div
            v-for="(category, index) in categories"
            :key="category.id"
            class="p-4 hover:bg-gray-50 transition-colors"
            :style="`animation: fadeInUp 0.3s ease-out ${index * 0.05}s both`"
          >
            <div class="flex items-start gap-3 mb-4">
              <!-- Bild -->
              <SafeImage
                :src="getCategoryImage(category)"
                :alt="category.name"
                icon-class="w-8 h-8 text-gray-400"
                class="h-20 w-20 rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm flex-shrink-0"
              />

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-2">
                  <div class="p-1.5 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg">
                    <Tag class="w-3.5 h-3.5 text-indigo-600" />
                  </div>
                  <h3 class="font-bold text-gray-900 truncate text-lg">{{ category.name }}</h3>
                </div>

                <!-- Product Info -->
                <div v-if="getProductInfo(category)" class="flex items-center gap-2 mt-2">
                  <SafeImage
                    :src="getProductInfo(category).image"
                    :alt="getProductInfo(category).title"
                    :fallback-icon="Package"
                    icon-class="w-3 h-3 text-gray-400"
                    class="h-8 w-8 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0"
                  />
                  <div class="min-w-0">
                    <p class="text-xs font-semibold text-gray-900 truncate">
                      {{ getProductInfo(category).title }}
                    </p>
                    <p class="text-xs text-gray-500">ID: {{ getProductInfo(category).id }}</p>
                  </div>
                </div>
                <p v-else class="text-xs text-gray-400 italic mt-2">Kein Produkt verknüpft</p>
              </div>
            </div>

            <!-- Aktionen -->
            <div class="flex gap-2">
              <button
                @click="openEditModal(category)"
                class="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all text-sm font-semibold"
              >
                <Edit2 class="w-4 h-4" />
                Bearbeiten
              </button>
              <button
                @click="handleDelete(category)"
                :disabled="deletingIds.has(category.id)"
                class="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-red-50 to-red-100 text-red-600 rounded-xl hover:from-red-100 hover:to-red-200 transition-all text-sm font-semibold disabled:opacity-50"
              >
                <Loader2 v-if="deletingIds.has(category.id)" class="w-4 h-4 animate-spin" />
                <Trash2 v-else class="w-4 h-4" />
                Löschen
              </button>
            </div>
          </div>

          <!-- Empty State Mobile -->
          <div v-if="categories.length === 0" class="text-center py-16 px-4">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag class="w-8 h-8 text-gray-400" />
            </div>
            <p class="text-gray-500 text-lg font-semibold mb-2">Keine Kategorien</p>
            <p class="text-gray-400 text-sm mb-6">Erstelle deine erste Kategorie</p>
            <button
              @click="openCreateModal"
              class="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-xl transition-all font-semibold"
            >
              <Plus class="w-5 h-5" />
              Kategorie erstellen
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <teleport to="body">
      <transition name="modal">
        <div
          v-if="showModal"
          @click="closeModal"
          class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-0 md:p-4"
        >
          <div @click.stop class="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full md:max-w-5xl max-h-[95vh] md:max-h-[90vh] overflow-hidden flex flex-col">
            <!-- Modal Header -->
            <div class="flex items-center justify-between gap-4 p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
              <h2 class="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div class="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl">
                  <component :is="editMode ? Edit2 : Plus" class="w-5 h-5 text-white" />
                </div>
                {{ editMode ? 'Kategorie bearbeiten' : 'Neue Kategorie' }}
              </h2>
              <button
                @click="closeModal"
                class="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-2 rounded-xl transition"
              >
                <X class="w-6 h-6" />
              </button>
            </div>

            <!-- Modal Body -->
            <div class="flex-1 overflow-hidden flex flex-col">
              <div class="flex-1 overflow-y-auto">
                <!-- Form Section -->
                <div class="p-6 space-y-6 border-b border-gray-200">
                  <!-- Category Name -->
                  <div>
                    <label for="categoryName" class="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <Tag class="w-4 h-4 text-indigo-600" />
                      Kategoriename <span class="text-red-500">*</span>
                    </label>
                    <input
                      id="categoryName"
                      v-model="form.name"
                      type="text"
                      placeholder="z.B. Landschaften, Porträts..."
                      maxlength="255"
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      required
                      @input="onNameInput"
                    />
                    <p class="text-xs text-gray-500 mt-1">
                      Aktueller Wert: "{{ form.name }}" (Länge: {{ form.name.length }})
                    </p>
                  </div>

                  <!-- Selected Product Preview -->
                  <div v-if="form.selectedProduct" class="space-y-2">
                    <label class="block text-sm font-bold text-gray-700 flex items-center gap-2">
                      <CheckCircle2 class="w-4 h-4 text-green-600" />
                      Ausgewähltes Produkt
                    </label>
                    <div class="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
                      <SafeImage
                        :src="form.selectedProduct.image"
                        :alt="form.selectedProduct.title"
                        :fallback-icon="Package"
                        icon-class="w-6 h-6 text-gray-400"
                        class="h-14 w-14 rounded-xl overflow-hidden border border-gray-200 shadow-sm flex-shrink-0"
                      />
                      <div class="flex-1 min-w-0">
                        <p class="font-bold text-gray-900 truncate">
                          {{ form.selectedProduct.title || `Produkt #${form.selectedProduct.id}` }}
                        </p>
                        <p class="text-xs text-gray-600">ID: {{ form.selectedProduct.id }}</p>
                      </div>
                      <button
                        type="button"
                        @click="form.selectedProduct = null"
                        class="text-gray-400 hover:text-red-600 p-2 hover:bg-white rounded-lg transition"
                      >
                        <X class="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Products Section -->
                <div class="p-6">
                  <!-- Search & Header -->
                  <div class="space-y-3 mb-4">
                    <div class="flex items-center justify-between">
                      <label class="block text-sm font-bold text-gray-700 flex items-center gap-2">
                        <Package class="w-4 h-4 text-indigo-600" />
                        Produkt auswählen
                      </label>
                      <button
                        type="button"
                        @click="loadProducts"
                        :disabled="productsLoading"
                        class="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 disabled:opacity-50"
                      >
                        <RefreshCw :class="['w-3.5 h-3.5', { 'animate-spin': productsLoading }]" />
                        Neu laden
                      </button>
                    </div>

                    <!-- Search Input -->
                    <div class="relative">
                      <Search class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Produkte durchsuchen..."
                        class="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      />
                      <button
                        v-if="searchQuery"
                        @click="searchQuery = ''"
                        type="button"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X class="w-5 h-5" />
                      </button>
                    </div>

                    <div class="flex items-center gap-2 text-sm">
                      <span class="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-bold">
                        {{ displayedProducts.length }}
                      </span>
                      <span class="text-gray-600">
                        {{ displayedProducts.length === 1 ? 'Produkt' : 'Produkte' }}
                        {{ hasSearchQuery ? 'gefunden' : 'verfügbar' }}
                      </span>
                    </div>
                  </div>

                  <!-- Products Loading -->
                  <div v-if="productsLoading" class="text-center py-12">
                    <Loader2 class="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-3" />
                    <p class="text-gray-600 font-medium">Produkte werden geladen...</p>
                  </div>

                  <!-- Products Error -->
                  <div v-else-if="productsError" class="text-center py-12">
                    <AlertCircle class="w-12 h-12 text-red-400 mx-auto mb-3" />
                    <p class="text-red-600 font-medium mb-2">{{ productsError }}</p>
                    <button
                      type="button"
                      @click="loadProducts"
                      class="text-sm text-indigo-600 hover:text-indigo-700 font-semibold underline"
                    >
                      Erneut versuchen
                    </button>
                  </div>

                  <!-- Products List -->
                  <div v-else-if="displayedProducts.length > 0" class="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                    <button
                      v-for="product in displayedProducts"
                      :key="product.id"
                      type="button"
                      @click="toggleProductSelection(product)"
                      class="w-full flex items-center gap-4 p-3 border-2 rounded-xl transition-all"
                      :class="{
                        'border-indigo-500 bg-gradient-to-r from-indigo-50 to-indigo-100 shadow-md': isProductSelected(product),
                        'border-gray-200 hover:border-gray-300 hover:bg-gray-50': !isProductSelected(product)
                      }"
                    >
                      <SafeImage
                        :src="product.image"
                        :alt="product.title"
                        :fallback-icon="Package"
                        icon-class="w-6 h-6 text-gray-400"
                        class="h-14 w-20 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0"
                      />
                      <div class="flex-1 min-w-0 text-left">
                        <p class="font-bold text-gray-900 truncate">
                          {{ product.title || `Produkt #${product.id}` }}
                        </p>
                        <p class="text-xs text-gray-500">ID: {{ product.id }}</p>
                      </div>
                      <div class="flex-shrink-0">
                        <span
                          v-if="isProductSelected(product)"
                          class="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-full flex items-center gap-1"
                        >
                          <CheckCircle2 class="w-3.5 h-3.5" />
                          Ausgewählt
                        </span>
                        <span
                          v-else
                          class="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs font-semibold rounded-full"
                        >
                          Auswählen
                        </span>
                      </div>
                    </button>
                  </div>

                  <!-- Products Empty State -->
                  <div v-else class="text-center py-12">
                    <Package class="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p class="text-gray-600 font-medium">
                      {{ hasSearchQuery ? 'Keine Produkte gefunden' : 'Keine Produkte vorhanden' }}
                    </p>
                    <p class="text-gray-400 text-sm mt-2">
                      {{ hasSearchQuery ? 'Versuche einen anderen Suchbegriff' : 'Bitte erstelle zuerst Produkte' }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Form Actions -->
              <div class="flex gap-3 p-6 border-t border-gray-200 bg-white">
                <button
                  type="button"
                  @click="closeModal"
                  :disabled="isSubmitting"
                  class="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Abbrechen
                </button>
                <button
                  @click="handleSubmit"
                  :disabled="isSubmitting || !form.name.trim()"
                  class="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl hover:shadow-xl transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Loader2 v-if="isSubmitting" class="w-5 h-5 animate-spin" />
                  <Save v-else class="w-5 h-5" />
                  {{ editMode ? 'Speichern' : 'Erstellen' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- Toast Notifications -->
    <teleport to="body">
      <div class="fixed top-4 right-4 md:top-6 md:right-6 z-[60] space-y-2 max-w-sm">
        <transition-group name="toast">
          <div
            v-for="toast in toasts"
            :key="toast.id"
            :class="[
              'flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-white font-semibold backdrop-blur-sm',
              toast.type === 'success' ? 'bg-green-600/95' :
              toast.type === 'error' ? 'bg-red-600/95' : 'bg-gray-800/95'
            ]"
          >
            <component
              :is="toast.type === 'success' ? CheckCircle2 : toast.type === 'error' ? XCircle : AlertCircle"
              class="w-5 h-5 flex-shrink-0"
            />
            <span class="flex-1">{{ toast.message }}</span>
            <button @click="removeToast(toast.id)" class="hover:bg-white/20 rounded-lg p-1.5 transition">
              <X class="w-4 h-4" />
            </button>
          </div>
        </transition-group>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCategoryStore } from '@/stores/Categories';
import { useProductStore } from '@/stores/Products';
import {
  Plus, Edit2, Trash2, X, Save, Tag, Loader2, AlertCircle, XCircle,
  CheckCircle2, Search, Package, ImageIcon, RefreshCw
} from 'lucide-vue-next';

// ===== SafeImage Component =====
import { defineComponent, h } from 'vue';

const SafeImage = defineComponent({
  name: 'SafeImage',
  props: {
    src: {
      type: String,
      default: null
    },
    alt: {
      type: String,
      default: ''
    },
    fallbackIcon: {
      type: [Object, Function],
      default: () => ImageIcon
    },
    iconClass: {
      type: String,
      default: 'w-6 h-6 text-gray-400'
    }
  },
  setup(props, { attrs }) {
    const hasError = ref(false);

    const getImageUrl = (image) => {
      if (!image) return null;

      if (image.startsWith('http://') || image.startsWith('https://')) {
        return image;
      }

      if (image.startsWith('blob:')) {
        return image;
      }

      return `${process.env.VUE_APP_API_URL}/storage/${image}`;
    };

    const imageUrl = computed(() => getImageUrl(props.src));

    const handleError = () => {
      hasError.value = true;
    };

    const handleLoad = () => {
      hasError.value = false;
    };

    return () => {
      const containerClass = attrs.class || '';

      return h('div', {
        class: `${containerClass} bg-gradient-to-br from-gray-100 to-gray-200 relative`
      }, [
        !hasError.value && imageUrl.value
          ? h('img', {
              src: imageUrl.value,
              alt: props.alt,
              class: 'w-full h-full object-cover',
              loading: 'lazy',
              onError: handleError,
              onLoad: handleLoad
            })
          : h('div', {
              class: 'w-full h-full flex items-center justify-center'
            }, [
              h(props.fallbackIcon, {
                class: props.iconClass
              })
            ])
      ]);
    };
  }
});

// ===== STORES =====
const categoryStore = useCategoryStore();
const productStore = useProductStore();

// ===== CATEGORIES =====
const categories = computed(() => {
  const cats = categoryStore.categories;
  return Array.isArray(cats) ? cats : [];
});

const isLoading = computed(() => categoryStore.loading);

const error = computed(() => {
  const errors = categoryStore.errors;
  return Array.isArray(errors) && errors.length ? errors[0] : null;
});

// ===== STATS =====
const categoriesWithImages = computed(() =>
  categories.value.filter(c => getCategoryImage(c)).length
);

const categoriesWithProducts = computed(() =>
  categories.value.filter(c => getProductInfo(c) !== null).length
);

// ===== PRODUCTS =====
const productsLoading = ref(false);
const productsError = ref(null);
const allProducts = ref([]);

// ===== MODAL STATE =====
const showModal = ref(false);
const editMode = ref(false);
const isSubmitting = ref(false);
const searchQuery = ref('');

const form = ref({
  name: '',
  selectedProduct: null,
  categoryToEdit: null
});

// ===== SEARCH =====
const hasSearchQuery = computed(() => searchQuery.value.trim().length > 0);

const displayedProducts = computed(() => {
  if (!hasSearchQuery.value) return allProducts.value;

  const q = searchQuery.value.trim().toLowerCase();
  return allProducts.value.filter(p => {
    const title = (p?.title || '').toLowerCase();
    const idStr = String(p?.id || '').toLowerCase();
    return title.includes(q) || idStr.includes(q);
  });
});

// ===== TOASTS =====
let toastCounter = 0;
const toasts = ref([]);

function showToast(message, type = 'success') {
  const id = ++toastCounter;
  toasts.value.push({ id, message, type });
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  }, 4000);
}

function removeToast(id) {
  toasts.value = toasts.value.filter(t => t.id !== id);
}

// ===== DELETE STATE =====
const deletingIds = ref(new Set());

// ===== HELPERS =====
function onNameInput() {
  console.log('Name input changed:', form.value.name);
}

function getProductInfo(category) {
  // Wenn product Object vorhanden (von Relationship)
  if (category.product && typeof category.product === 'object') {
    return {
      id: category.product.id,
      title: category.product.title,
      image: category.product.image
    };
  }

  // Wenn nur product_id vorhanden, suche in allProducts
  if (category.product_id) {
    const product = allProducts.value.find(p => p.id === category.product_id);
    if (product) {
      return {
        id: product.id,
        title: product.title,
        image: product.image
      };
    }
    // Fallback wenn Produkt nicht in Liste
    return {
      id: category.product_id,
      title: `Produkt #${category.product_id}`,
      image: null
    };
  }

  return null;
}

function getCategoryImage(category) {
  const productInfo = getProductInfo(category);
  return productInfo?.image || category.image || null;
}

function isProductSelected(product) {
  return form.value.selectedProduct &&
         form.value.selectedProduct.id === product.id;
}

function toggleProductSelection(product) {
  if (isProductSelected(product)) {
    form.value.selectedProduct = null;
  } else {
    form.value.selectedProduct = product;
  }
}

// ===== PRODUCTS LADEN =====
async function loadProducts() {
  productsLoading.value = true;
  productsError.value = null;

  try {
    await productStore.loadAllProducts("", "", "");

    const rawProducts = productStore.products;

    if (!rawProducts) {
      allProducts.value = [];
      return;
    }

    let extractedProducts = [];

    if (Array.isArray(rawProducts)) {
      extractedProducts = rawProducts;
    } else if (Array.isArray(rawProducts.data)) {
      extractedProducts = rawProducts.data;
    } else if (rawProducts.data && Array.isArray(rawProducts.data.data)) {
      extractedProducts = rawProducts.data.data;
    }

    allProducts.value = extractedProducts;

  } catch (error) {
    console.error('Fehler beim Laden der Produkte:', error);
    productsError.value = 'Fehler beim Laden der Produkte';
    showToast('Fehler beim Laden der Produkte', 'error');
  } finally {
    productsLoading.value = false;
  }
}

// ===== MODAL FUNCS =====
function openCreateModal() {
  editMode.value = false;
  form.value = { name: '', selectedProduct: null, categoryToEdit: null };
  searchQuery.value = '';
  showModal.value = true;

  console.log('🆕 Create Modal opened');

  if (allProducts.value.length === 0) {
    loadProducts();
  }
}

function openEditModal(category) {
  editMode.value = true;

  console.log('✏️ Edit Modal opened for category:', category);
  console.log('📊 Category structure:', JSON.stringify(category, null, 2));

  // Finde die tatsächliche numerische ID
  // Manchmal ist category.id der Name, und die echte ID ist woanders
  let numericId = null;

  // Versuche verschiedene Felder für die ID
  if (typeof category.id === 'number') {
    numericId = category.id;
  } else if (typeof category.category_id === 'number') {
    numericId = category.category_id;
  } else if (typeof category.pk === 'number') {
    numericId = category.pk;
  } else {
    // Suche in categories array nach einem Match mit dem Namen
    const foundCategory = categories.value.find(c => c.name === category.name);
    if (foundCategory) {
      // Durchsuche alle Felder nach einer numerischen ID
      for (const key in foundCategory) {
        if (typeof foundCategory[key] === 'number' && key.toLowerCase().includes('id')) {
          numericId = foundCategory[key];
          break;
        }
      }
    }
  }

  console.log('🔑 Found numeric ID:', numericId, 'from category:', category);

  // Product Info aus Category extrahieren
  const productInfo = getProductInfo(category);
  let selectedProduct = null;

  if (productInfo) {
    // Versuche das vollständige Product Object zu finden
    selectedProduct = allProducts.value.find(p => p.id === productInfo.id) || {
      id: productInfo.id,
      title: productInfo.title,
      image: productInfo.image
    };
  }

  // Erstelle ein sauberes category object mit der richtigen ID
  const categoryToEdit = {
    ...category,
    numericId: numericId, // Speichere die numerische ID separat
    originalId: category.id // Behalte die Original-ID
  };

  form.value = {
    name: category.name,
    selectedProduct,
    categoryToEdit: categoryToEdit
  };

  console.log('📝 Form initialized with:', {
    name: form.value.name,
    selectedProduct: form.value.selectedProduct,
    categoryToEdit: form.value.categoryToEdit
  });

  searchQuery.value = '';
  showModal.value = true;

  if (allProducts.value.length === 0) {
    loadProducts();
  }
}

function closeModal() {
  showModal.value = false;
  setTimeout(() => {
    form.value = { name: '', selectedProduct: null, categoryToEdit: null };
    searchQuery.value = '';
    isSubmitting.value = false;
  }, 300);
}

// ===== CRUD =====
async function handleSubmit() {
  console.log('🚀 Submit started with form:', {
    name: form.value.name,
    nameLength: form.value.name.length,
    nameTrimmed: form.value.name.trim(),
    selectedProduct: form.value.selectedProduct,
    categoryToEdit: form.value.categoryToEdit,
    editMode: editMode.value
  });

  if (isSubmitting.value) {
    console.warn('❌ Submit blocked: Already submitting');
    return;
  }

  if (!form.value.name || !form.value.name.trim()) {
    console.warn('❌ Submit blocked: Name is empty');
    showToast('Kategoriename darf nicht leer sein', 'error');
    return;
  }

  isSubmitting.value = true;

  try {
    const categoryName = form.value.name.trim();
    const productId = form.value.selectedProduct ? form.value.selectedProduct.id : null;

    if (editMode.value && form.value.categoryToEdit) {
      // Verwende numericId wenn vorhanden, sonst versuche id zu konvertieren
      let categoryId = form.value.categoryToEdit.numericId || form.value.categoryToEdit.id;

      // Wenn id ein String ist, versuche nach numerischer ID zu suchen
      if (typeof categoryId === 'string') {
        console.warn('⚠️ Category ID is string:', categoryId);

        // Suche in der categories Liste nach der richtigen numerischen ID
        const foundCategory = categories.value.find(c => c.name === categoryId || c.name === categoryName);
        if (foundCategory) {
          // Durchsuche alle Felder nach einer numerischen ID
          for (const key in foundCategory) {
            if (typeof foundCategory[key] === 'number' && (key === 'id' || key.toLowerCase().includes('id'))) {
              categoryId = foundCategory[key];
              console.log('✅ Found numeric ID in field:', key, '=', categoryId);
              break;
            }
          }
        }
      }

      categoryId = Number(categoryId);

      if (isNaN(categoryId)) {
        console.error('❌ Invalid category ID after conversion:', form.value.categoryToEdit);
        showToast('Kategorie-ID konnte nicht ermittelt werden', 'error');
        return;
      }

      console.log('✏️ Calling updateCategory with:', {
        categoryId,
        categoryName,
        productId
      });

      // KORRIGIERTE PARAMETER-REIHENFOLGE: categoryId, categoryName, productId
      await categoryStore.updateCategory(
        categoryId,
        categoryName,
        productId
      );

      console.log('✅ Update successful');
      showToast('Kategorie erfolgreich aktualisiert', 'success');
    } else {
      console.log('🆕 Calling storeCategory with:', {
        categoryName,
        productId
      });

      // KORRIGIERTE PARAMETER-REIHENFOLGE: categoryName, productId
      await categoryStore.storeCategory(
        categoryName,
        productId
      );

      console.log('✅ Create successful');
      showToast('Kategorie erfolgreich erstellt', 'success');
    }

    await categoryStore.loadAllCategories();
    closeModal();
  } catch (error) {
    console.error('❌ Error in handleSubmit:', error);
    console.error('Error response:', error?.response?.data);

    const errorMsg = error?.response?.data?.errors
      ? Object.values(error.response.data.errors).flat()[0]
      : error?.response?.data?.message
        || (editMode.value ? 'Fehler beim Aktualisieren' : 'Fehler beim Erstellen');

    showToast(errorMsg, 'error');
  } finally {
    isSubmitting.value = false;
  }
}

async function handleDelete(category) {
  if (deletingIds.value.has(category.id)) return;
  if (!confirm(`Möchten Sie die Kategorie "${category.name}" wirklich löschen?`)) return;

  deletingIds.value.add(category.id);

  try {
    await categoryStore.removeCategory(category.id);
    await categoryStore.loadAllCategories();
    showToast('Kategorie erfolgreich gelöscht', 'success');
  } catch (error) {
    console.error('Fehler beim Löschen:', error);
    showToast(
      error?.response?.data?.message || 'Fehler beim Löschen',
      'error'
    );
  } finally {
    deletingIds.value.delete(category.id);
  }
}

// ===== INIT =====
async function loadData() {
  try {
    await categoryStore.loadAllCategories();

    // Debug: Zeige die erste Kategorie um die Struktur zu sehen
    if (categories.value.length > 0) {
      console.log('📊 First category from API:', JSON.stringify(categories.value[0], null, 2));
      console.log('🔑 First category ID field:', categories.value[0].id, 'Type:', typeof categories.value[0].id);
    }
  } catch (err) {
    console.error('Fehler beim Laden der Daten:', err);
    showToast('Fehler beim Laden der Daten', 'error');
  }
}

onMounted(() => {
  loadData();
});
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .bg-white {
  transform: scale(0.95) translateY(20px);
}

.modal-leave-to .bg-white {
  transform: scale(0.95) translateY(20px);
}

/* Mobile Modal - slide up */
@media (max-width: 768px) {
  .modal-enter-from .bg-white {
    transform: translateY(100%);
  }
  .modal-leave-to .bg-white {
    transform: translateY(100%);
  }
}

/* Toast Transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(50px);
  opacity: 0;
}

.toast-move {
  transition: transform 0.3s ease;
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #6366f1, #818cf8);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #4f46e5, #6366f1);
}
</style>