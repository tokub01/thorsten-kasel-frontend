<template>
  <component :is="layoutComponent">
    <router-view />
  </component>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AuthLayout from '@/layouts/authLayout.vue';
import GuestLayout from '@/layouts/guestLayout.vue';

const route = useRoute();

const layoutComponent = computed(() => {
  return route.meta.layout === 'auth' ? AuthLayout : GuestLayout;
});
</script>
