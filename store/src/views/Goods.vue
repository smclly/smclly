<template>
	<div class="goods" id="goods" name="goods">
		<!-- 面包屑 -->
		<div class="breadcrumb">
			<el-breadcrumb separator-class="el-icon-arrow-right">
				<el-breadcrumb-item to="/">首页</el-breadcrumb-item>
				<el-breadcrumb-item>全部商品</el-breadcrumb-item>
				<el-breadcrumb-item v-if="search">搜索</el-breadcrumb-item>
				<el-breadcrumb-item v-else>分类</el-breadcrumb-item>
				<el-breadcrumb-item v-if="search">{{search}}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<!-- 面包屑END -->

		<!-- 分类标签 -->
		<div class="nav">
			<div class="product-nav">
				<div class="title">分类</div>
				<!-- el-tabs 切换标签页 -->
				<el-tabs v-model="activeName" type="card">  <!-- v-model 就是value  与下面的:name绑定-->
					<el-tab-pane v-for="item in categoryList" :key="item.category_id" :label="item.category_name"
						:name="''+item.category_id" />  <!-- 动态绑定名字以及标签？？ :label="item.category_name  选项卡标题  :name与第一个选项卡的value对应-->
				</el-tabs>
			</div>
		</div>
		<!-- 分类标签END -->

		<!-- 主要内容区 -->
		<div class="main">
			<div class="list">
				<MyList :list="product" v-if="product.length>0"></MyList>
				<div v-else class="none-product">抱歉没有找到相关的商品，请看看其他的商品</div>
			</div>
			<!-- 分页 -->
			<div class="pagination">
				<el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="total"
					@current-change="currentChange"></el-pagination>
			</div>
			<!-- 分页END -->
		</div>
		<!-- 主要内容区END -->
	</div>
</template>
<script>
	export default {
		data() {
			return {
				categoryList: "", //分类列表
				categoryID: [], // 分类id
				product: "", // 商品列表
				productList: "",
				total: 0, // 商品总量
				pageSize: 15, // 每页显示的商品数量
				currentPage: 1, //当前页码
				activeName: "-1", // 分类列表当前选中的id  全部
				search: "", // 搜索条件
				searchID:""  //搜索返回的id
			};
		},
		created() {
			// 获取分类列表
			this.getCategory();			
		},
		//activated()函数就是一个页面激活后的钩子函数，一进入页面就触发； 另类的监视属性
		//初始化页面的数据  多次执行  该钩子在服务器端渲染期间不被调用  deactived函数 对应的解除激活
		activated() { 
			this.activeName = "-1"; // 初始化分类列表当前选中的id为-1
			this.total = 0; // 初始化商品总量为0
			this.currentPage = 1; //初始化当前页码为1
			//console.log('11111')
			// 如果路由没有传递参数，默认为显示全部商品
			
			/* 参数：要返回其枚举自身属性的对象
			返回值：一个表示给定对象的所有可枚举属性的字符串数组 */
			if (Object.keys(this.$route.query).length == 0) {
				this.categoryID = [];
				this.activeName = "0";  //没有指定 默认给到一个id  全部商品的值
				return;
			}
			
			// 如果路由传递了categoryID，则显示对应的分类商品  从手机或者其他的浏览更多的页面进来
			if (this.$route.query.categoryID != undefined) {
				this.categoryID = this.$route.query.categoryID;
				if (this.categoryID.length == 1) {  //0-9
					//控制分类样式  通过搜索，或者分类的点击，实现更新选中的分类id
					this.activeName = "" + this.categoryID[0];  
				}
				return;
			}
			// 如果路由传递了search，则为搜索，显示对应的分类商品
			if (this.$route.query.search != undefined) {
				//因为父组件只根据搜索框，通过query传递了一个搜索条件的参数，获取对应的数据还是需要在子组件内执行
				this.search = this.$route.query.search;
				
				
			}
		},
		watch: {
			// 监听点击了哪个分类标签，通过修改分类id，响应相应的商品
			activeName: function(val) {
				if (val == 0) {
					this.categoryID = [];
				}
				if (val > 0) {
					//数据类型转换
					this.categoryID = [Number(val)];
					//console.log(this.categoryList)
					//console.log(this.categoryID)
				}
				// 初始化商品总量和当前页码
				this.total = 0;
				this.currentPage = 1;
				// 更新地址栏链接，方便刷新页面可以回到原来的页面
				this.$router.push({
					path: "/goods",
					query: {
						categoryID: this.categoryID
					}
				});
			},
			// 监听搜索条件，响应相应的商品
			//因为父组件只根据搜索框，通过query传递了一个搜索条件的参数，获取对应的数据还是需要在子组件内执行
			search: function(val) {
				if (val != "") {
					this.getProductBySearch(val);
				}
			},
			// 监听分类id，响应相应的商品
			categoryID: function() {
				this.getData();
				this.search = "";
			},
			//完成搜索 更新 分类的显示样式
			/* 要实现这个样式，其他的是通过获取搜索分类结果的id做事，
			更新样式，这里需要通过获取返回的结果，然后更新data里面
			的一个数据，通过监视数据改变对应的分类样式 */
			searchID:function(){
				this.activeName = "" + this.searchID
				//console.log('111',this.activeName)
			},
			// 监听路由变化，更新路由传递了搜索条件
			$route: function(val) {
				if (val.path == "/goods") {
					if (val.query.search != undefined) {
						this.activeName = "-1";
						this.currentPage = 1;
						this.total = 0;
						this.search = val.query.search;
					}
				}
			}
		},
		methods: {
			// 返回顶部
			backtop() {
				const timer = setInterval(function() {
					const top = document.documentElement.scrollTop || document.body.scrollTop;
					const speed = Math.floor(-top / 5);
					document.documentElement.scrollTop = document.body.scrollTop =
						top + speed;

					if (top === 0) {
						clearInterval(timer);
					}
				}, 20);
			},
			// 页码变化调用currentChange方法
			currentChange(currentPage) {
				this.currentPage = currentPage;
				if (this.search != "") {
					this.getProductBySearch();
				} else {
					this.getData();
				}
				this.backtop();
			},
			// 向后端请求分类列表数据
			/* 要数据，接收对象数据 */
			getCategory() {
				this.$axios
					.post("/api/product/getCategory", {})
					.then(res => {
						//初始化一个，然后往里面加数据
						const val = {
							category_id: 0,
							category_name: "全部"
						};
						//console.log(res)
						const cate = res.data.category;
						cate.unshift(val);
						/* 要的是对应的分类id和分类名称 并更新 */
						this.categoryList = cate;
					})
					.catch(err => {
						return Promise.reject(err);
					});
			},
			// 向后端请求全部商品或分类商品数据
			getData() {
				// 如果分类列表为空则请求全部商品数据，否则请求分类商品数据
				const api =
					this.categoryID.length == 0 ?
					"/api/product/getAllProduct" :
					"/api/product/getProductByCategory";
				this.$axios
					.post(api, {
						categoryID: this.categoryID,
						currentPage: this.currentPage,
						pageSize: this.pageSize
					})
					.then(res => {
						this.product = res.data.Product;
						this.total = res.data.total;
					})
					.catch(err => {
						return Promise.reject(err);
					});
			},
			// 通过搜索条件向后端请求商品数据
			/* 这里感觉有点太草率了，需要做一个模糊搜索吧，这个是后端的工作吗 
				个人理解是后端的事，但是在前端工作时，应该也可以做一些事，通过异步请求，在用户输入搜索条件时，做到显示出一些响应的数据
				方法： indexOf 或者正则
				大致思路 每按下一个键，向后台发请求，后台返回一个模糊的查询字段，然后搜索的地方就出现一个下拉框，显示前十条数据内容
				界面显示 把搜索框和ul li 放在一个盒子里 如果有输入关键词，那么就显示li 然后根据拿到的数据，用v-for进行遍历，
				 var list = ["中国", "美国", "英国 "];
				
				        var len = list.length;
				        var arr = [];
				        var reg = new RegExp("关键字或字符串");
				        for(var i=0;i<len;i++){
				          
				            if(list[i].match(reg)){
				                arr.push(list[i]);
				                console.log(arr);
				            }
				        }
			
			*/
			getProductBySearch() {
				this.$axios
					.post("/api/product/getProductBySearch", {
						search: this.search,
						currentPage: this.currentPage,
						pageSize: this.pageSize
					})
					.then(res => {
						//console.log(res)
						//更新搜索的对应的id，然后去更新要显示的分类名称的样式
						//要做数据类型转换吧 
						this.searchID = ""+ res.data.Product[0].category_id   
						//console.log(this.searchID)
						this.product = res.data.Product;
						this.total = res.data.total;
					})
					.catch(err => {
						return Promise.reject(err);
					});
			}
		}
	};
</script>

<style scoped>
	.goods {
		background-color: #f5f5f5;
	}

	/* 面包屑CSS */
	.el-tabs--card .el-tabs__header {
		border-bottom: none;
	}

	.goods .breadcrumb {
		height: 50px;
		background-color: white;
	}

	.goods .breadcrumb .el-breadcrumb {
		width: 1225px;
		line-height: 30px;
		font-size: 16px;
		margin: 0 auto;
	}

	/* 面包屑CSS END */

	/* 分类标签CSS */
	.goods .nav {
		background-color: white;
	}

	.goods .nav .product-nav {
		width: 1225px;
		height: 40px;
		line-height: 40px;
		margin: 0 auto;
	}

	.nav .product-nav .title {
		width: 50px;
		font-size: 16px;
		font-weight: 700;
		float: left;
	}

	/* 分类标签CSS END */

	/* 主要内容区CSS */
	.goods .main {
		margin: 0 auto;
		max-width: 1225px;
	}

	.goods .main .list {
		min-height: 650px;
		padding-top: 14.5px;
		margin-left: -13.7px;
		overflow: auto;
	}

	.goods .main .pagination {
		height: 50px;
		text-align: center;
	}

	.goods .main .none-product {
		color: #333;
		margin-left: 13.7px;
	}

	/* 主要内容区CSS END */
</style>
