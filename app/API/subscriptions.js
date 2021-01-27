import axios from 'axios';
var subscriptionsApi = axios.create({
	baseURL: process.env.API_URI,
});

export default subscriptionsApi;
