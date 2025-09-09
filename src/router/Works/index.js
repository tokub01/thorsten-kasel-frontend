import WorksPage from '@/pages/Works/worksPage.vue'

const routes = [
    {
        path: '/works',
        name: 'works',
        component: WorksPage,
        meta: { layout: 'guest', requiresAuth: false },
    },
]
export default routes;