import { createRouter, createWebHistory } from 'vue-router'
const Home = () => import('../views/home/Home');
const Category = () => import('../views/category/Category')
const Detail = () => import('../views/detail/Detail')
const Profile = () => import('../views/profile/Profile')
const ShowCart = () => import('../views/shopcart/ShopCart')
const Register = () => import('../views/profile/Register')
const Login = () => import('../views/profile/Login')
const Address = () => import('../views/profile/Address')
const AddressEdit = () => import('../views/profile/AddressEdit')
const CreateOrder = () => import('../views/order/CreateOrder')

import store from '../store'
import {Notify} from "vant";

const routes = [
  {
    path: '/',
    name: 'DefaultHome',
    component: Home,
    meta: {
      title: 'EwShop-首页',
      keepAlive: true,
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {
      title: 'EwShop-首页',
      keepAlive: true,
    }
  },
  {
    path: '/category',
    name: 'Category',
    component: Category,
    meta: {
      title: 'EwShop-分类',
      keepAlive: true,
    }
  },
  {
    path: '/detail',
    name: 'Detail',
    component: Detail,
    meta: {
      title: 'EwShop-商品详情',
      keepAlive: false,
    }
  },
  {
    path: '/shopcart',
    name: 'ShopCart',
    component: ShowCart,
    meta: {
      title: 'EwShop-购物车',
      isAuthRequired: true,
      keepAlive: false,
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      title: 'EwShop-个人中心',
      isAuthRequired: true,
      keepAlive: true,
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      title: 'EwShop-用户注册',
      keepAlive: false,
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: 'EwShop-用户登录',
      keepAlive: false,
    }
  },
  {
    path: '/address',
    name: 'Address',
    component: Address,
    meta: {
      title: 'EwShop-地址管理',
      isAuthRequired: true,
      keepAlive: false,
    }
  },
  {
    path: '/addressedit',
    name: 'AddressEdit',
    component: AddressEdit,
    meta: {
      title: 'EwShop-地址编辑',
      isAuthRequired: true,
      keepAlive: false,
    }
  },
  {
    path: '/createorder',
    name: 'CreateOrder',
    component: CreateOrder,
    meta: {
      title: 'EwShop-订单预览',
      isAuthRequired: true,
      keepAlive: false,
    }
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  // 如果没有登录，在这里login
  if (to.meta.isAuthRequired && store.state.user.isLogin === false) {
    Notify('您还没有登录，请先登录！')
    return next('/login')
  }else {
    next()
  }
  // 设置页面标题
  document.title = to.meta.title;
})

export default router
