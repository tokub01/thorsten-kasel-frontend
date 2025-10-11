import NewsPage from '@/pages/News/newsPage.vue'
import NewsAdminPage from '@/pages/News/newsAdminPage.vue'

const routes = [
    {
        path: '/news',
        name: 'news',
        component: NewsPage,
        meta: { layout: 'guest', requiresAuth: false },
    },
    {
        path: '/admin/newsPage',
        name: 'newsAdminPage',
        component: NewsAdminPage,
        meta: { layout: 'auth', requiresAuth: true },
    },
]
export default routes;
