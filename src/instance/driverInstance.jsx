import axios from "axios";

//-----------------Instance-----------------//

export const driverInstance = axios.create({
  baseURL: "http://localhost:4000/api/driver",
});

//-----------------Axios Interceptors-----------------//

// Injecting jwt in every request
driverInstance.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem("driverToken"));
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default driverInstance;
