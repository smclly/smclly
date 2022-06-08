<template>
	<div id="app" name="app">
		<el-container>
			<!-- 顶部导航栏 -->
			<div class="topbar">
				<div class="nav">
					<ul>
						<!-- vuex中没有找到用户数据，就显示登录和注册的按钮-->
						<li v-if="!this.$store.getters.getUser">
							<el-button type="text" @click="login">登录</el-button>
							<span class="sep">|</span>
							<el-button type="text" @click="register = true">注册</el-button>
						</li>
						<!-- 有就显示用户名称 -->
						<li v-else>
							欢迎
							<!-- 点击用户名，弹出框 两个按钮，  visible  根据数据显示，点击取消后，该弹出框隐藏  点击确认后，调用退出函数，清除本地的token，将该弹出框隐藏-->
							<el-popover placement="top" width="180" v-model="visible">
								<p>确定退出登录吗？</p>
								<div style="text-align: right; margin: 10px 0 0">
									<el-button size="mini" type="text" @click="visible = false">取消</el-button>
									<el-button type="primary" size="mini" @click="logout">确定</el-button>
								</div>
								<!-- 显示用户名 -->
								<!-- slot="reference"  点击用户名，触发上面的这个popover的对话框 -->
								<el-button type="text" slot="reference">{{this.$store.getters.getUser.userName}}
								</el-button>
							</el-popover>
						</li>
						<li>
							<router-link to="/order">我的订单</router-link>
						</li>
						<li>
							<router-link to="/collect">我的收藏</router-link>
						</li>
						<!-- 三元表达式， 背景样式问题， 根据购物车的数量是否大于零来判断 -->
						<li :class="getNum > 0 ? 'shopCart-full' : 'shopCart'">
							<router-link to="/shoppingCart"><strong></strong>
								<i class="el-icon-shopping-cart-full"></i> 购物车
								<!-- 获取购物车的商品数量 -->
								<span class="num">({{getNum}})</span>
							</router-link>
						</li>
					</ul>
				</div>
			</div>
			<!-- 顶部导航栏END -->

			<!-- 顶栏容器 -->
			<el-header>
				<!--二级菜单，设置高亮，绑定一个值， 设置样式，以及水平排列  router为下级菜单设置 是否使用 
				vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转  -->
				<!-- :default-active="activeIndex" 该值为当前路由路径，只有在当前路由下--即首页，二级菜单下的文字才能高亮显示 -->
				<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal"
					active-text-color="#409eff" router>
					<div class="logo">
						<!-- 跳转到首页组件 -->
						<router-link to="/">
							<img src="./assets/imgs/logo.png" alt />
						</router-link>
					</div>
					<!-- 跳转到对应的组件 -->
					<el-menu-item index="/">首页</el-menu-item>
					<el-menu-item index="/goods">全部商品</el-menu-item>
					<el-menu-item index="/about">关于我们</el-menu-item>

					<!-- 搜索框 双向数据绑定，通过关键词去发请求  这个里面的插槽不是很懂 -->
					<div class="so">
						<el-input placeholder="请输入搜索内容" v-model="search">
							<el-button slot="append" icon="el-icon-search" @click="searchClick"></el-button>
						</el-input>
					</div>
				</el-menu>
			</el-header>
			<!-- 顶栏容器END -->

			<!-- 注册和登录模块因为是弹出的样式，不用进行路由跳转，注册成全局组件 -->
			<!-- 登录模块 -->
			<MyLogin></MyLogin>
			<!-- 注册模块 -->
			<!-- 给注册组件传数据  点击头部的注册，将属性值改为true，传递的是true 字符串形式  -->
			<MyRegister :register="register" @fromChild="isRegister"></MyRegister>

			<!-- 主要区域容器 -->
			<el-main>
				<!-- 保持活跃，并且不会即时跳转了也能回来，
				在组件切换过程中将状态保留在内存中，防止重复渲染DOM，减少加载时间及性能消耗，提高用户体验性-->
				<keep-alive>
					<router-view></router-view>
				</keep-alive>
			</el-main>
			<!-- 主要区域容器END -->

			<!-- 底栏容器 -->
			<el-footer>
				<div class="footer">
					<div class="ng-promise-box">
						<div class="ng-promise">
							<p class="text">
								<!-- a标签必须要给href属性，写javascript:; 什么都不执行，写空的，点击后会刷新页面，写#会跳转到当前页面顶部   -->
								<!-- <a class="icon1" href="#">7天无理由退换货</a>
								<a class="icon2" href="">满99元全场免邮</a> -->
								<a class="icon1" href="javascript:;">7天无理由退换货</a>
								<a class="icon2" href="javascript:;">满99元全场免邮</a>
								<a class="icon3" style="margin-right: 0" href="javascript:;">100%品质保证</a>
							</p>
						</div>
					</div>
					<div class="github">
						<a href="https://github.com/hai-27/vue-store" target="_blank">
							<div class="github-but"></div>
						</a>
					</div>
					<div class="mod_help">
						<p>
							<router-link to="/">首页</router-link>
							<span>|</span>
							<router-link to="/goods">全部商品</router-link>
							<span>|</span>
							<router-link to="/about">关于我们</router-link>
						</p>
						<p class="coty">商城版权所有 &copy; 2012-2021</p>
					</div>
				</div>
			</el-footer>
			<!-- 底栏容器END -->
		</el-container>
	</div>
</template>

<script>
	import {
		mapActions
	} from "vuex";
	import {
		mapGetters
	} from "vuex";

	export default {
		beforeUpdate() {
			//绑定当前路由路径，仅在当前路由下高亮，即首页
			this.activeIndex = this.$route.path;
		},
		data() {
			return {
				activeIndex: "", // 头部导航栏选中的标签
				search: "", // 搜索条件
				register: false, // 是否显示注册组件
				visible: false, // 是否退出登录			
			};
		},
		//组件创建之前，本地获取token  --二次登录
		created() {
			// 获取浏览器localStorage，判断用户是否已经登录
			if (localStorage.getItem("user")) {
				// 如果已经登录，设置vuex登录状态
				this.setUser(JSON.parse(localStorage.getItem("user")));
			}
			/* window.setTimeout(() => {
			  this.$message({
			    duration: 0,
			    showClose: true,
			    message: ``,
			    dangerouslyUseHTMLString: true,
			    type: "success"
			  });
			}, 1000 * 60); */
		},
		//计算属性，将vuex中的一些方法拿到
		computed: {
			...mapGetters(["getUser", "getNum"])
		},
		watch: {
			// 获取vuex的登录状态
			//获取用户的信息
			getUser: function(val) {
				if (val === "") {
					// 用户没有登录
					this.setShoppingCart([]);
				} else {
					// 用户已经登录,获取该用户的购物车信息
					this.$axios
						.post("/api/user/shoppingCart/getShoppingCart", {
							user_id: val.user_id
						})
						.then(res => {
							if (res.data.code === "001") {
								// 001 为成功, 更新vuex购物车状态
								this.setShoppingCart(res.data.shoppingCartData);
							} else {
								// 提示失败信息
								this.notifyError(res.data.msg);
							}
						})
						.catch(err => {
							return Promise.reject(err);
						});
				}
			}
		},
		methods: {
			//拿到vuex中的一些方法
			...mapActions(["setUser", "setShowLogin", "setShoppingCart"]),
			login() {
				// 点击登录按钮, 通过更改vuex的showLogin值显示登录组件
				//this.$store.dispatch('setShowLogin', true)
				this.setShowLogin(true); //修改vuex里的state的showLogin为true，显示登录的组件 将token存储在本地
			},
			// 退出登录
			logout() {
				this.visible = false;
				// 清空本地登录信息
				localStorage.setItem("user", "");
				// 清空vuex登录信息
				this.setUser("");
				this.notifySucceed("已退出登录");
			},
			// 接收注册子组件传过来的数据  将data里的register重新设置为false  下次注册的时候流程一样
			isRegister(val) {
				this.register = val;
			},
			// 点击搜索按钮
			searchClick() {
				//搜索框非空，即有搜索输入 通过query传参  跳转到商品页面  最后再重置搜索的关键词
				if (this.search != "") {
					// 跳转到全部商品页面,并传递搜索条件
					this.$router.push({
						path: "/goods",
						query: {
							search: this.search
						}
					});
					this.search = "";
				}
			}
		}
	};
</script>

<style>
	/* 全局CSS */
	* {
		padding: 0;
		margin: 0;
		border: 0;
		list-style: none;
	}

	#app .el-header {
		padding: 0;
	}

	#app .el-main {
		min-height: 300px;
		padding: 20px 0;
	}

	#app .el-footer {
		padding: 0;
	}

	a,
	a:hover {
		text-decoration: none;
	}

	/* 全局CSS END */

	/* 顶部导航栏CSS */
	.topbar {
		height: 40px;
		background-color: #3d3d3d;
		margin-bottom: 20px;
	}

	.topbar .nav {
		width: 1225px;
		margin: 0 auto;
	}

	.topbar .nav ul {
		float: right;
	}

	.topbar .nav li {
		float: left;
		height: 40px;
		color: #b0b0b0;
		font-size: 14px;
		text-align: center;
		line-height: 40px;
		margin-left: 20px;
	}

	.topbar .nav .sep {
		color: #b0b0b0;
		font-size: 12px;
		margin: 0 5px;
	}

	.topbar .nav li .el-button {
		color: #b0b0b0;
	}

	.topbar .nav .el-button:hover {
		color: #fff;
	}

	.topbar .nav li a {
		color: #b0b0b0;
	}

	.topbar .nav a:hover {
		color: #fff;
	}

	.topbar .nav .shopCart {
		width: 120px;
		background: #424242;
	}

	.topbar .nav .shopCart:hover {
		background: #fff;
	}

	.topbar .nav .shopCart:hover a {
		color: #ff6700;
	}

	.topbar .nav .shopCart-full {
		width: 120px;
		background: #ff6700;
	}

	.topbar .nav .shopCart-full a {
		color: white;
	}

	/* 顶部导航栏CSS END */

	/* 顶栏容器CSS */
	.el-header .el-menu {
		max-width: 1225px;
		margin: 0 auto;
	}

	.el-header .logo {
		height: 60px;
		width: 189px;
		float: left;
		margin-right: 100px;
	}

	.el-header .so {
		margin-top: 10px;
		width: 300px;
		float: right;
	}

	/* 顶栏容器CSS END */

	/* 底栏容器CSS */
	.footer {
		width: 100%;
		text-align: center;
		background: #2f2f2f;
		padding-bottom: 20px;
	}

	.footer .ng-promise-box {
		border-bottom: 1px solid #3d3d3d;
		line-height: 145px;
	}

	.footer .ng-promise-box {
		margin: 0 auto;
		border-bottom: 1px solid #3d3d3d;
		line-height: 145px;
	}

	.footer .ng-promise-box .ng-promise p a {
		color: #fff;
		font-size: 20px;
		margin-right: 210px;
		padding-left: 44px;
		height: 40px;
		display: inline-block;
		line-height: 40px;
		text-decoration: none;
		background: url("./assets/imgs/us-icon.png") no-repeat left 0;
	}

	.footer .github {
		height: 50px;
		line-height: 50px;
		margin-top: 20px;
	}

	.footer .github .github-but {
		width: 50px;
		height: 50px;
		margin: 0 auto;
		background: url("./assets/imgs/github.png") no-repeat;
	}

	.footer .mod_help {
		text-align: center;
		color: #888888;
	}

	.footer .mod_help p {
		margin: 20px 0 16px 0;
	}

	.footer .mod_help p a {
		color: #888888;
		text-decoration: none;
	}

	.footer .mod_help p a:hover {
		color: #fff;
	}

	.footer .mod_help p span {
		padding: 0 22px;
	}

	/* 底栏容器CSS END */
</style>
