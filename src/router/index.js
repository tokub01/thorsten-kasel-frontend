import { createRouter, createWebHistory } from 'vue-router'
import Auth from './Auth/index.js'
import Home from './Home'
import Landing from './Landing'
import MaintenancePage from '@/pages/Errors/maintenancePage.vue'
import PageDataPrivacy from "@/pages/DataPrivacy/pageDataPrivacy.vue";
import PageImprint from "@/pages/Imprint/pageImprint.vue";
import Works from './Works'
import Biography from "./Biography";
import Categories from "./Categories";
import Products from "./Products";
import AdminBiography from "./AdminBiography";
import ContactRequests from "@/router/ContactRequests";
import Contact from "@/router/Contact"
import News from "@/router/News"
import Exhibitions from "@/router/Exhibitions"
function isAuthenticated() {
    return !!localStorage.getItem('authToken');
}

const router = createRouter({
    history: createWebHistory(process.env.VUE_APP_BASE_URL),
    routes: [
        {
            path: '/imprint',
            name: 'imprint',
            component: PageImprint,
        },
        {
            path: '/dataprivacy',
            name: 'dataprivacy',
            component: PageDataPrivacy,
        },
        {
            path: '/503',
            name: 'MaintenancePage',
            component: MaintenancePage,
        },
        ...Exhibitions,
        ...News,
        ...Contact,
        ...ContactRequests,
        ...AdminBiography,
        ...Categories,
        ...Products,
        ...Works,
        ...Biography,
        ...Landing,
        ...Home,
        ...Auth,
    ],
})

router.beforeEach((to, from, next) => {
    const loggedIn = isAuthenticated();
    const isMaintenance = process.env.VUE_APP_MAINTENANCE_MODE === 'true';

    if (isMaintenance && to.path === '/imprint') {
        return next();
    }
    if (isMaintenance && to.path === '/dataprivacy') {
        return next();
    }

    if (isMaintenance && to.path !== '/503') {
        return next({ path: '/503' });
    }

    if (!isMaintenance && to.path === '/503') {
        return next({ name: 'landing' });
    }

    if (to.meta.requiresAuth && !loggedIn) {
        return next({ name: 'landing' });
    }

    if (!to.matched.length) {
        return loggedIn ? next('/home') : next('/');
    }

    next();
});

export default router
