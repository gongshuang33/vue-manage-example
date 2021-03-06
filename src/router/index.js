import Vue from "vue"
import VueRouter from "vue-router"
import Login from "../components/Login.vue" // 导入登录页面
import Home from "../components/Home.vue" // 导入home页面
import Welcome from "../components/Welcome.vue" // 导入欢迎页面
import User from '../components/user/Users.vue' // 导入user页面
import Rights from '../components/power/Rights.vue';
import Roles from '../components/power/Roles.vue';
import Cate from '../components/goods/Cate.vue';
import Params from '../components/goods/Params.vue';
import List from '../components/goods/List.vue';
import Add from '../components/goods/Add.vue';
import Order from '../components/order/Order.vue';
import Report from '../components/report/Report.vue';
Vue.use(VueRouter)

const routes = [
  {
    // 重定向，访问/时自动跳转到/login
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/home",
    component: Home,
    redirect: "/welcome",
    children: [
			{ path: "/welcome", component: Welcome },
			{ path: "/users", component: User },
			{ path: "/rights", component: Rights},
			{ path: "/roles", component: Roles},
			{ path: "/categories", component: Cate},
			{ path: "/params", component: Params},
			{ path: "/goods", component: List},
			{ path: "/goods/add", component: Add},
			{ path: "/orders", component: Order},
			{ path: "/reports", component: Report},
		],
  },
]

const router = new VueRouter({
  routes,
})

//为路由对象，添加beforeEach导航守卫
//  to将要访问的路径
//  from 代表从哪个路径跳转而来
//  next是一个函数，表示放行
//  next()放行   next('/login') 强制跳转
router.beforeEach((to, from, next) => {

  //从sessionstorage中获取到保存的 token值
  const tokenstr = window.sessionStorage.getItem("token")

  //如果用户访问的登录页,且登录过，直接进入主页
  if (to.path === "/login" && tokenstr) return next("/home")
  
	//如果用户访问的登录页,且没有登录过，则进入登录页
  if (to.path === "/login" ) return next()
  //如果没有token，强制跳转到登录页
  if (!tokenstr) return next("/login")
  if (to.path !== window.sessionStorage.getItem('activePath')) {
		window.sessionStorage.setItem('activePath','')
	}

  next()
})

export default router
