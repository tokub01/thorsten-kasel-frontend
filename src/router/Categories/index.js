import CategoryPage from '@/pages/Categories/categoryPage.vue'

const routes = [
    {
        path: '/categories',
        name: 'categories',
        component: CategoryPage,
        meta: { layout: 'auth', requiresAuth: true },
    },
]
export default routes;
