import axios from 'axios';

//-----------------Instance-----------------//

export const instance = axios.create({
    baseURL:"http://localhost:4000/api/user"
})

//-----------------Axios Interceptors-----------------//

// Injecting jwt in every request
instance.interceptors.request.use((config) => {
    const token = JSON.parse(localStorage.getItem("clientToken"));
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },(error) => {
    return Promise.reject(error);
  }
);

export default instance; 