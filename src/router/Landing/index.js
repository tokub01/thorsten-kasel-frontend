import CategoryPage from '@/pages/Works/categoryPage.vue'

const routes = [
    {
        path: '/',
        name: 'landing',
        component: CategoryPage,
        meta: { layout: 'guest', requiresAuth: false },
    },
]
export default routes;
