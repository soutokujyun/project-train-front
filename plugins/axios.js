import Vue from 'vue';
import axios from 'axios';

const service = axios.create({
    // timeout: 5,
    baseURL: '/api'
})

// 请求拦截


Vue.prototype.$http = service

export const http = service