import axios, {AxiosInstance} from 'axios';

const isDev = process.env.NODE_ENV === 'development';

const myAxios: AxiosInstance = axios.create({
	baseURL: isDev ? 'http://localhost:8080/api' : 'http://localhost:8080/api'
});
myAxios.defaults.withCredentials = true;

// Add a request interceptor
myAxios.interceptors.request.use(function (config) {
	console.log('axios发请求了');
	// Do something before request is sent
	return config;
}, function (error) {
	// Do something with request error
	return Promise.reject(error);
});

// Add a response interceptor
myAxios.interceptors.response.use(function (response) {
	console.log('axios接收到请求了', response.data);
	if (response?.data?.code === 40100) {
		const redirectUrl = window.location.href;
		window.location.href = `/user/login?redirect=${redirectUrl}`;
	}
	return response.data;
}, function (error) {
	// Do something with response error
	return Promise.reject(error);
});


export default myAxios;