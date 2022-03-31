import axios from "axios";
import { Notify, Toast } from 'vant';
import router from "../router";

export function request(config) {
    const instance = axios.create({
        baseURL: 'https://api.shop.eduwork.cn',
        timeout: 5000
    })

    // 请求拦截
    instance.interceptors.request.use(config=> {
        // 如果一个接口需要认证才可以访问，在这里统一设置
        const token = window.localStorage.getItem('token')

        if (token) {
            config.headers.Authorization = 'Bearer '+token
        }
        return config
    }, error => {

    })
    // 响应拦截
    instance.interceptors.response.use(response=>{
        return response.data ? response.data : response
    }, error => {
        // 如果有需要授权才可以访问的接口，统一去login授权
        if (error.response.status == 401) {
            Toast.fail('请先登录！')

            setTimeout(() => {
                router.push('/login')
            },300)
        }

        // 如果有错误，这里处理，显示错误信息
        Notify(error.response.data.errors[Object.keys(error.response.data.errors)[0]][0])
    })

    return instance(config)
}