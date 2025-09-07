import UserLogin from '@/pages/Auth/userLogin.vue'
import UserRegistration from '@/pages/Auth/userRegistration.vue'

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: UserLogin,
        meta: { layout: 'guest' }
    },
    {
        path: '/register',
        name: 'Register',
        component: UserRegistration,
        meta: { layout: 'guest' },
    },
]
export default routes;