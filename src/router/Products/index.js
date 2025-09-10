import ProductsPage from '@/pages/Products/productPage.vue'

const routes = [
    {
        path: '/products',
        name: 'products',
        component: ProductsPage,
        meta: { layout: 'auth', requiresAuth: true },
    },
]
export default routes;
