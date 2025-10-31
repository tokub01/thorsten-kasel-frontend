<template>
<div>
    <div class="bg-gray-300 flex justify-center mt-10">
        {{store.errorMessage}}
        {{store.successMessage}}
    </div>
</div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import { useRoute } from 'vue-router'
import {useContactStore} from '@/stores/Contact'

const store = useContactStore()

const route = useRoute()

const token = ref("");

onMounted(() => {

    try{
        token.value =  route.params.token
        store.verify(token.value)
    }catch(e){
        console.error(e)
    }
});

</script>

<style>

</style>