import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5001/api",
});

//Axios to automatically send that token whenever we call a protected backend endpoint.
//interceptor is a checkpoint before axios sends a request.
api.interceptors.request.use(
    (config)=>{
        const token = localStorage.getItem("token");

        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error)=>{
        return Promise.reject(error);
    }
)

export default api;