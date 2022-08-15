<template>
	<div class="home" id="home" name="home">
		<!-- 轮播图 -->
		<div class="block">
			<!-- 轮播图的ui -->
			<el-carousel height="460px">
				<el-carousel-item v-for="item in carousel" :key="item.carousel_id">
					<!-- 通过proxy配置，直接找服务器要图片的地址，根据v-for 的id 来显示  -->
					<img style="height:460px;" :src="$target + item.imgPath" :alt="item.describes" />
				</el-carousel-item>
			</el-carousel>
		</div>
		<!-- 轮播图END -->
		<div class="main-box">
			<div class="main">
				<!-- 手机商品展示区域 -->
				<div class="phone">
					<div class="box-hd">
						<div class="title">手机</div>
					</div>
					<div class="box-bd">
						<div class="promo-list">
							<!-- 动态绑定手机的图片 -->
							<router-link to>
								<img :src="$target +'public/imgs/phone/phone.png'" />
							</router-link>
						</div>
						<div class="list">
							<!-- 手机列表的组件 -->
							<MyList :list="phoneList" :isMore="true"></MyList>
						</div>
					</div>
				</div>
				<!-- 手机商品展示区域END -->

				<!-- 家电商品展示区域 -->
				<div class="appliance" id="promo-menu">
					<div class="box-hd">
						<div class="title">家电</div>
						<div class="more" id="more">
							<!-- 也是一个组件 -->
							<!-- slot  根据不同的点击，来获取到不同的数据内容  该组件动态绑定两个slot-->
							<!-- 插槽 ---  挖坑 与填坑  -->
							<MyMenu :val="2" @fromChild="getChildMsg">
								<span slot="1">热门</span>
								<span slot="2">电视影音</span>
							</MyMenu>
						</div>
					</div>
					<div class="box-bd">
						<div class="promo-list">
							<ul>
								<!-- 动态绑定响应的图片地址-->
								<li>
									<img :src="$target +'public/imgs/appliance/appliance-promo1.png'" />
								</li>
								<li>
									<img :src="$target +'public/imgs/appliance/appliance-promo2.png'" />
								</li>
							</ul>
						</div>
						<div class="list">
							<!-- 组件复用 -->
							<MyList :list="applianceList" :isMore="true"></MyList>
						</div>
					</div>
				</div>
				<!-- 家电商品展示区域END -->

				<!-- 配件商品展示区域 -->
				<div class="accessory" id="promo-menu">
					<div class="box-hd">
						<div class="title">配件</div>
						<div class="more" id="more">
							<!-- 组件复用 -->
							<MyMenu :val="3" @fromChild="getChildMsg2">
								<span slot="1">热门</span>
								<span slot="2">保护套</span>
								<span slot="3">充电器</span>
							</MyMenu>
						</div>
					</div>
					<div class="box-bd">
						<div class="promo-list">
							<ul>
								<li>
									<img :src="$target +'public/imgs/accessory/accessory-promo1.png'" alt />
								</li>
								<li>
									<img :src="$target +'public/imgs/accessory/accessory-promo2.png'" alt />
								</li>
							</ul>
						</div>
						<div class="list">
							<!-- 组件复用 -->
							<MyList :list="accessoryList" :isMore="true"></MyList>
						</div>
					</div>
				</div>
				<!-- 配件商品展示区域END -->
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				carousel: "", // 轮播图数据
				phoneList: "", // 手机商品列表
				miTvList: "", // 小米电视商品列表
				applianceList: "", // 家电商品列表
				applianceHotList: "", //热门家电商品列表
				accessoryList: "", //配件商品列表
				accessoryHotList: "", //热门配件商品列表
				protectingShellList: "", // 保护套商品列表
				chargerList: "", //充电器商品列表
				applianceActive: 1, // 家电当前选中的商品分类
				accessoryActive: 1 // 配件当前选中的商品分类
			};
		},
		watch: {
			// 家电当前选中的商品分类，响应不同的商品数据
			applianceActive: function(val) {
				//初始化的时候为空的数据，后面创建后的请求更新对应的数据
				if (this.applianceHotList == "") {
					this.applianceHotList = this.applianceList;
				}
				if (val == 1) {
					// 1为热门商品
					this.applianceList = this.applianceHotList;
					return;
				}
				if (val == 2) {
					// 2为电视商品
					this.applianceList = this.miTvList;
					return;
				}
			},
			accessoryActive: function(val) {
				// 默认和创建该组件后的首次请求 获取到数据并更行
				if (this.accessoryHotList == "") {
					this.accessoryHotList = this.accessoryList;
				}
				if (val == 1) {
					// 1为热门商品
					this.accessoryList = this.accessoryHotList;
					return;
				}
				if (val == 2) {
					// 2为保护套商品
					this.accessoryList = this.protectingShellList;
					return;
				}
				if (val == 3) {
					//3 为充电器商品
					this.accessoryList = this.chargerList;
					return;
				}
			}
		},
		/* 挂载或创建后，尽量在创建后获取数据*/
		created() {
			// 获取轮播图数据
			this.$axios
				.post("/api/resources/carousel", {})
				.then(res => {
					this.carousel = res.data.carousel;
				})
				.catch(err => {
					return Promise.reject(err);
				});
			// 获取各类商品数据 调用一个函数，因为是字符串，所以要加引号
			this.getPromo("手机", "phoneList");
			this.getPromo("电视机", "miTvList");
			this.getPromo("保护套", "protectingShellList");
			this.getPromo("充电器", "chargerList");
			this.getPromo(
				["电视机", "空调", "洗衣机"],
				"applianceList",
				"/api/product/getHotProduct"
			);
			this.getPromo(
				["保护套", "保护膜", "充电器", "充电宝"],
				"accessoryList",
				"/api/product/getHotProduct"
			);
		},
		methods: {
			// 获取家电模块子组件传过来的数据
			getChildMsg(val) {
				this.applianceActive = val;
			},
			// 获取配件模块子组件传过来的数据
			getChildMsg2(val) {
				this.accessoryActive = val;
			},
			/* 获取各类商品数据方法封装 
				工厂函数，根据不同的函数调用，获取不同的数据，在每次调用时，将data中的空数据名称传递过来，
				然后根据请求的返回结果，将对应的数据给到data中对应的每一个大分类
			*/
			getPromo(categoryName, val, api) {
				//console.log(val)
				//如果没有指定的api接口，就给默认的一个api接口 获取数据
				api = api != undefined ? api : "/api/product/getPromoProduct";
				this.$axios
					.post(api, {
						categoryName
					})
					.then(res => {
						this[val] = res.data.Product;
						//console.log(this)
						//console.log(this[val])
					})
					.catch(err => {
						return Promise.reject(err);
					});
			},
		}
	};
</script>
<style scoped>
	@import "../assets/css/index.css";
</style>
