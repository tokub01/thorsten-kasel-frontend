import NewsPage from '@/pages/News/newsPage.vue'
import NewsDetailsPage from '@/pages/News/newsDetailsPage.vue'

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
]
export default routes;
