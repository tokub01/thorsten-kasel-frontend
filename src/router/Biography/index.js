import BiographyPage from '@/pages/Biography/biographyPage.vue'

const routes = [
    {
        path: '/biography',
        name: 'biography',
        component: BiographyPage,
        meta: { layout: 'guest', requiresAuth: false },
    },
]
export default routes;
