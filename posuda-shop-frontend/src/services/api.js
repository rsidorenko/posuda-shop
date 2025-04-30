import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api", // Адрес backend'а
});

// Добавим токен в заголовки если пользователь залогинен
API.interceptors.request.use((req) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.token) {
        req.headers.Authorization = `Bearer ${user.token}`;
    }
    return req;
});

export default API;
