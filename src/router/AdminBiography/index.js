import AdminBiography from '@/pages/AdminBiography/AdminBiographyPage.vue'

const routes = [
    {
        path: '/adminBiography',
        name: 'adminBiography',
        component: AdminBiography,
        meta: { layout: 'auth', requiresAuth: true },
    },
]
export default routes;