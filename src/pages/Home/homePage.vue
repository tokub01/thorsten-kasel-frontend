<template>
  <div>
    Home Page
  </div>
</template>

<script setup>
import { useProductStore } from '@/stores/Products'
const productStore = useProductStore()

productStore.loadSingleProduct(8)

function handleFileChange(event) {
  let formData = new FormData()
  formData.append("image", event.target.files[0])
  formData.append('title', 'test')
  formData.append('description', 'test')
  formData.append('category_id', '1')

  productStore.storeProduct(formData)
}



</script>
