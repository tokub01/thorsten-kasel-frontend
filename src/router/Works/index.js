import WorksPage from '@/pages/Works/worksPage.vue'
import CategoryPage from '@/pages/Works/categoryPage.vue'

const routes = [
    {
        path: '/works',
        name: 'works',
        component: CategoryPage,
        meta: { layout: 'guest', requiresAuth: false },
    },
    {
        path: '/works/:categoryId',
        name: 'worksDetailPage',
        component: WorksPage,
        meta: { layout: 'guest', requiresAuth: false },
    },
]
export default routes;