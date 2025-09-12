import ContactRequestsPage from '@/pages/ContactRequests/ContactRequestsPage.vue'

const routes = [
    {
        path: '/contactRequests',
        name: 'contactRequests',
        component: ContactRequestsPage,
        meta: { layout: 'auth', requiresAuth: true },
    },
]
export default routes;