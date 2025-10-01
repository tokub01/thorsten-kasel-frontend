import ContactPage from '@/pages/Contact/contactPage.vue'

const routes = [
    {
        path: '/contact',
        name: 'contact',
        component: ContactPage,
        meta: { layout: 'guest', requiresAuth: false },
    },
]
export default routes;
