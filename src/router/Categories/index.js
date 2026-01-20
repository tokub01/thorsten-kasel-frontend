import CategoryPage from '@/pages/Categories/categoryPage.vue'
// Importiere hier deine Werke-Komponente (Detailseite)
import WorksPage from '@/pages/Works/worksPage.vue'

const routes = [
    {
        path: '/categories',
        name: 'categories',
        component: CategoryPage,
        meta: { layout: 'auth', requiresAuth: true },
    },
    {
        // Der Doppelpunkt : markiert einen dynamischen Parameter
        path: '/categories/:categoryId',
        name: 'worksPage',
        component: WorksPage,
        meta: { layout: 'auth', requiresAuth: true },
    },
]

export default routes;