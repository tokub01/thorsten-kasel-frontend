import ExhibitionsPage from '@/pages/Exhibitions/exhibitionsPage.vue'
import ExhibitionsDetailsPage from '@/pages/Exhibitions/exhibitionsDetailsPage.vue'
import ExhibitionsAdminPage from '@/pages/Exhibitions/exhibitionsAdminPage.vue'


const routes = [
    {
        path: '/exhibitions',
        name: 'exhibitions',
        component: ExhibitionsPage,
        meta: { layout: 'guest', requiresAuth: false },
    },

    {
        path: '/exhibitions/:exhibitionsId',
        name: 'exhibitionDetailPage',
        component: ExhibitionsDetailsPage,
        meta: { layout: 'guest', requiresAuth: false },
    },
    {
        path: '/admin/exhibitions',
        name: 'exhibitionsAdminPage',
        component: ExhibitionsAdminPage,
        meta: { layout: 'auth', requiresAuth: true },
    },
]
export default routes;
