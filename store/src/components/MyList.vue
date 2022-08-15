<template>
	<div id="myList" class="myList">
		<ul>
			<li v-for="item in list" :key="item.product_id">
				<!-- 父容器绑定一个data的数据，两个按钮控制该容器的显示与隐藏 容器外面的按钮属性 控制 slot="reference"  -->

				<el-popover placement="top" >
					<p>确定删除吗？</p>
					<div style="text-align: right; margin: 10px 0 0">
						<!-- 添加一个按钮，点击弹出对话框，将data中的数据变成ture，取消按钮，将其设置为false -->
						<el-button type="primary" size="mini" @click="deleteCollect(item.product_id)">确定</el-button>					
					</div>
					<!-- slot="reference" 点击就弹出对话框，按钮提示框吧这个样子 触发 Popover -->
					<i class="el-icon-close delete" slot="reference" v-show="isDelete"></i>
					<!-- @click="vis = true"-->
				</el-popover>

				<!-- 路由跳转，跳转到商品细节的组件去  根据query传参 -->
				<router-link :to="{ path: '/goods/details', query: {productID:item.product_id} }">
					<img :src="$target +item.product_picture" alt />
					<h2>{{item.product_name}}</h2>
					<h3>{{item.product_title}}</h3>
					<p>
						<span>{{item.product_selling_price}}元</span>
						<!-- 标价与售价不符，显示一个特殊的样式 -->
						<span v-show="item.product_price != item.product_selling_price"
							class="del">{{item.product_price}}元</span>
					</p>
				</router-link>
			</li>
			<li v-show="isMore && list.length>=6" id="more">
				<!--声明式导航，动态绑定产品分类 的id，根据id跳转	 -->
				<router-link :to="{ path: '/goods', query: {categoryID:categoryID} }">
					浏览更多
					<i class="el-icon-d-arrow-right"></i>
				</router-link>
			</li>
		</ul>
	</div>
</template>
<script>
	export default {
		name: "MyList",
		// list为父组件传过来的商品列表
		// isMore为是否显示“浏览更多”
		props: ["list", "isMore", "isDelete"],
		data() {
			return {
				//vis: false //控制删除收藏时的显示隐藏
			};
		},
		computed: {
			// 通过list获取当前显示的商品的分类ID，用于“浏览更多”链接的参数  这里考虑到了这个热门下的全部和单个分类
			categoryID: function() {
				let categoryID = [];
				/* 接收的商品列表应该是非空且大于等于7 不然没有意义。。  */
				if (this.list != "") {
					for (let i = 0; i < this.list.length; i++) {
						const id = this.list[i].category_id;
						/* 这个组件的分类id为空的数组，父组件传递很多商品过来，可能是单个分类，也可能是热门的分类 */
						if (!categoryID.includes(id)) {
							//console.log(id)
							categoryID.push(id);
						}
					}
				}
				return categoryID;
			}
		},
		methods: {
			//删除收藏  带着商品id发请求，请求成功，就弹出相应的信息
			deleteCollect(product_id) {
				//this.vis = false
				this.$axios
					.post("/api/user/collect/deleteCollect", {
						user_id: this.$store.getters.getUser.user_id,
						product_id: product_id
					})
					//if else 也可以
					.then(res => {
						switch (res.data.code) {
							case "001":
								// 删除成功
								// 删除收藏列表中的该商品信息
								for (let i = 0; i < this.list.length; i++) {
									const temp = this.list[i];
									if (temp.product_id == product_id) {
										this.list.splice(i, 1);
									}
								}
								// 提示删除成功信息
								this.notifySucceed(res.data.msg);
								break;
							default:
								// 提示删除失败信息
								this.notifyError(res.data.msg);
						}
					})
					.catch(err => {
						return Promise.reject(err);
					});
			}
		}
	};
</script>
<style scoped>
	.myList ul li {
		z-index: 1;
		float: left;
		width: 234px;
		height: 280px;
		padding: 10px 0;
		margin: 0 0 14.5px 13.7px;
		background-color: white;
		-webkit-transition: all 0.2s linear;
		transition: all 0.2s linear;
		position: relative;
	}

	.myList ul li:hover {
		z-index: 2;
		-webkit-box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
		box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
		-webkit-transform: translate3d(0, -2px, 0);
		transform: translate3d(0, -2px, 0);
	}

	.myList ul li img {
		display: block;
		width: 160px;
		height: 160px;
		background: url(../assets/imgs/placeholder.png) no-repeat 50%;
		margin: 0 auto;
	}

	.myList ul li h2 {
		margin: 25px 10px 0;
		font-size: 14px;
		font-weight: 400;
		color: #333;
		text-align: center;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	.myList ul li h3 {
		margin: 5px 10px;
		height: 18px;
		font-size: 12px;
		font-weight: 400;
		color: #b0b0b0;
		text-align: center;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	.myList ul li p {
		margin: 10px 10px 10px;
		text-align: center;
		color: #ff6700;
	}

	.myList ul li p .del {
		margin-left: 0.5em;
		color: #b0b0b0;
		text-decoration: line-through;
	}

	.myList #more {
		text-align: center;
		line-height: 280px;
	}

	.myList #more a {
		font-size: 18px;
		color: #333;
	}

	.myList #more a:hover {
		color: #ff6700;
	}

	.myList ul li .delete {
		position: absolute;
		top: 10px;
		right: 10px;
		display: none;
	}

	.myList ul li:hover .delete {
		display: block
	}

	.myList ul li .delete:hover {
		color: #ff6700;
	}
</style>
