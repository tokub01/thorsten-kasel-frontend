import LandingPage from '@/pages/Landing/landingPage.vue'

const routes = [
    {
        path: '/',
        name: 'landing',
        component: LandingPage,
        meta: { layout: 'guest', requiresAuth: false },
    },
]
export default routes;
