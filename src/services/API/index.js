import axios from 'axios';
import router from '@/router';

const axiosInstance = axios.create({
    baseURL: process.env.VUE_APP_API_URL + "/api",
    timeout: 10000,
    headers: { 'Content-Type': 'multipart/form-data'},
    withCredentials: true,
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
}
axiosInstance.interceptors.request.use(
    function (config) {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        const xsrfToken = getCookie('XSRF-TOKEN');
        if (xsrfToken) {
            config.headers['X-XSRF-TOKEN'] = xsrfToken;
        }

        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);
axiosInstance.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        if (error.response) {
            const status = error.response.status;

            if (status === 401 || status === 419) {
                localStorage.removeItem('authToken');

                router.push({ name: 'Login' });
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;