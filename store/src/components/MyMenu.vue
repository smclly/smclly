<template>
	<div class="myMenu" id="myMenu">
		<ul>
			<!-- 动态绑定样式 根据当前样式的值是否与获取到值相等 相等就显示对应的列表内容 -->
			<li v-for="item in val" :key="item" :class="activeClass == item ? 'active':''"
				@mouseover="mouseover($event,item)">
				<router-link to>
					<!-- 动态绑定 挖的坑 1  2  -->
					<slot :name="item"></slot>
				</router-link>
			</li>
		</ul>
	</div>
</template>
<script>
	export default {
		props: ["val"], //2  3
		name: "MyMenu",
		data() {
			return {
				activeClass: 1
			};
		},
		methods: {
			// 通过mouseover事件控制当前显示的商品分类，1为该类别的热门商品
			mouseover(e, val) {
				this.activeClass = val;
			}
		},
		watch: {
			/* 自定义事件*/
			// 向父组件传过去当前要显示的商品分类，从而更新商品列表
			activeClass: function(val) {
				this.$emit("fromChild", val);
			}
		}
	};
</script>
<style scoped>
	#myMenu li {
		float: left;
		margin-left: 30px;
	}

	#myMenu a:hover {
		color: #ff6700;
		border-bottom: 2px solid #ff6700;
	}

	#myMenu .active a {
		color: #ff6700;
		border-bottom: 2px solid #ff6700;
	}
</style>
