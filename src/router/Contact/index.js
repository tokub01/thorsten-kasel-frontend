import ContactPage from '@/pages/Contact/contactPage.vue'
import VerifyContactPage from '@/pages/Contact/verifyContactPage.vue'

const routes = [
    {
        path: '/contact',
        name: 'contact',
        component: ContactPage,
        meta: { layout: 'guest', requiresAuth: false },
    },
    {
        path: '/verifyContact/:token',
        name: 'verifyContact',
        component: VerifyContactPage,
        meta: { layout: 'guest', requiresAuth: false },
    },
]
export default routes;
