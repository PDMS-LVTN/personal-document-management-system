import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useAuthentication } from '../store/useAuth';

const BASE_URL = 'http://localhost:8080/api'
const REFRESH_URL = `${BASE_URL}/auth/refresh`;

export default axios.create({
    baseURL: BASE_URL
});

export const axiosJWT = axios.create({
    baseURL: BASE_URL
})

const refreshToken = async () => {
    try {
        const res = await axios.post(REFRESH_URL, {
            withCredentials: true,
        });
        return res.data
    } catch (err) {
        console.log(err);
    }
};

// Add a request interceptor
axiosJWT.interceptors.request.use(async (config) => {
    // Do something before request is sent
    let date = new Date();
    const auth = useAuthentication((state) => state.auth)
    const setAuth = useAuthentication((state) => state.setAuth);

    const decodedToken = jwtDecode(auth?.accessToken)
    if (decodedToken.exp < date.getTime() / 1000) {
        const data = await refreshToken();
        const refreshUser = { ...auth, accessToken: data.accessToken }
        setAuth(refreshUser);
        config.headers["token"] = "Bearer " + data.accessToken;
    }
    return config;
}, (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
});
