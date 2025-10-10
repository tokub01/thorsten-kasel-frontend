import NewsPage from '@/pages/News/newsPage.vue'
import NewsDetailsPage from '@/pages/News/newsDetailsPage.vue'
import NewsAdminDetailsPage from '@/pages/News/newsAdminDetailsPage.vue'
import NewsAdminPage from '@/pages/News/newsAdminDetailsPage.vue'

const routes = [
    {
        path: '/news',
        name: 'news',
        component: NewsPage,
        meta: { layout: 'guest', requiresAuth: false },
    },
    {
        path: '/news/:newsId',
        name: 'newsDetailsPage',
        component: NewsDetailsPage,
        meta: { layout: 'guest', requiresAuth: false },
    },
    {
        path: '/admin/newsPage/:newsId',
        name: 'newsAdminDetailsPage',
        component: NewsAdminDetailsPage,
        meta: { layout: 'auth', requiresAuth: true },
    },
    {
        path: '/admin/newsPage',
        name: 'newsAdminPage',
        component: NewsAdminPage,
        meta: { layout: 'auth', requiresAuth: true },
    },
]
export default routes;
