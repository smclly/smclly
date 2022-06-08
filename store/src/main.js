import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

//自定义插件导入
/* import myPlugins from './plugins/plugins'
//全局自定义指令配置和使用
Vue.use(myPlugins,{
	//配置名字，在页面元素中使用
	name:'upper'
}) */

// 全局函数及变量
import Global from './Global';
Vue.use(Global);

import Axios from 'axios';
Vue.prototype.$axios = Axios;
// 全局请求拦截器
Axios.interceptors.request.use(
	config => {
		//把token放请求头里面
		let token = localStorage.getItem("user")
		if (token) {
			config.headers.koken = token;			
		}
		return config;
	},
	error => {
		// 跳转error页面
		router.push({
			path: "/error"
		});
		return Promise.reject(error);
	}
);
// 全局响应拦截器
Axios.interceptors.response.use(
	res => {
		if (res.data.code === "401") {
			// 401表示没有登录
			// 提示没有登录
			Vue.prototype.notifyError(res.data.msg);
			// 修改vuex的showLogin状态,显示登录组件
			store.dispatch("setShowLogin", true);
		}
		if (res.data.code === "500") {
			// 500表示服务器异常
			// 跳转error页面
			router.push({
				path: "/error"
			});
		}
		return res;
	},
	error => {
		// 跳转error页面
		router.push({
			path: "/error"
		});
		return Promise.reject(error);
	}
);

// 全局拦截器,在进入需要用户权限的页面前校验是否已经登录
router.beforeResolve((to, from, next) => {
	//const loginUser = store.state.user.user;  //路由守卫 这里还是有问题
	const loginUser = store.state.user.user //state的小仓库下的user
	//console.log(loginUser)
	// 判断路由是否设置相应校验用户权限
	if (to.meta.requireAuth) {
		if (!loginUser) {
			// 没有登录，显示登录组件
			store.dispatch("setShowLogin", true);
			if (from.name == null) {
				//此时，是在页面没有加载，直接在地址栏输入链接，进入需要登录验证的页面
				next("/");
				return;
			}
			// 终止导航
			next(false);
			return;
		}
	}
	next();
});

// 相对时间过滤器,把时间戳转换成时间
// 格式: 2020-02-25 21:43:23
//创建 Vue 实例之前全局定义过滤器
Vue.filter('dateFormat', (dataStr) => {
	/* 根据dateFormat 进行过滤  接收一个参数  */
	//var myDate = new Date()  调用的是当前的时间
	/* 格式化  标准日期的格式化 */
	var time = new Date(dataStr);
	//console.log(time)
	//函数定义 后面调用  接收的参数，小于10 就是 10:05分  这样
	function timeAdd0(str) {
		if (str < 10) {
			str = '0' + str;
		}
		return str;
	}
	//获取对应的时间 和日期
	var y = time.getFullYear();
	var m = time.getMonth() + 1;
	//Date.getMonth() 返回值是 0 -11
	//var sss = time.getMonth();
	var d = time.getDate();
	var h = time.getHours();
	var mm = time.getMinutes();
	var s = time.getSeconds();
	console.log(y, m, d, h, mm, s)
	//返回的是格式化后的时间
	return y + '-' + timeAdd0(m) + '-' + timeAdd0(d) + ' ' + timeAdd0(h) + ':' + timeAdd0(mm) + ':' +
		timeAdd0(s);
});

//全局组件
import MyMenu from './components/MyMenu';
Vue.component(MyMenu.name, MyMenu);
import MyList from './components/MyList';
Vue.component(MyList.name, MyList);
import MyLogin from './components/MyLogin';
Vue.component(MyLogin.name, MyLogin);
import MyRegister from './components/MyRegister';
Vue.component(MyRegister.name, MyRegister);

Vue.config.productionTip = false;

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
