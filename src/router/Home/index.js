import HomePage from '@/pages/Home/homePage.vue'

const routes = [
    {
        path: '/home',
        name: 'home',
        component: HomePage,
        meta: { layout: 'auth', requiresAuth: true },
    },
]
export default routes;
