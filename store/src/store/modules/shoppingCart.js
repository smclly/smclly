export default {
	state: {
		shoppingCart: []
		// shoppingCart结构
		/* 
		shoppingCart = {
		  id: "", // 购物车id
		  productID: "", // 商品id
		  productName: "", // 商品名称
		  productImg: "", // 商品图片
		  price: "", // 商品价格
		  num: "", // 商品数量
		  maxNum: "", // 商品限购数量
		  check: false // 是否勾选
		} */
	},
	getters: {
		getShoppingCart(state) {
			// 获取购物车状态
			return state.shoppingCart;
		},
		getNum(state) {
			// 购物车商品总数量
			let totalNum = 0;
			for (let i = 0; i < state.shoppingCart.length; i++) {
				const temp = state.shoppingCart[i];
				//如果是= 就定死了，后台修改也不会变
				/* 每遍历一次购物车商品列表，都会将单个商品的数量加起来 */
				totalNum += temp.num;
				//console.log(totalNum)
			}
			return totalNum;
		},
		//全选
		getIsAllCheck(state) {
			// 判断是否全选
			let isAllCheck = true;
			for (let i = 0; i < state.shoppingCart.length; i++) {
				const temp = state.shoppingCart[i];
				// 只要有一个商品没有勾选立即return false;
				if (!temp.check) {
					isAllCheck = false;
					return isAllCheck;
				}
			}
			return isAllCheck;
		},
		getCheckGoods(state) {
			// 获取勾选的商品信息
			// 用于确认订单页面
			let checkGoods = [];
			//遍历购物车的长度
			for (let i = 0; i < state.shoppingCart.length; i++) {
				//遍历单个商品出来 赋值
				const temp = state.shoppingCart[i];
				if (temp.check) {  //一旦是true的属性， 就加到checkGoods里面 并返回
					checkGoods.push(temp);
				}
			}
			return checkGoods;
		},
		//获取被勾选的商品数量  
		getCheckNum(state) {
			// 获取购物车勾选的商品数量
			let totalNum = 0;
			for (let i = 0; i < state.shoppingCart.length; i++) {
				const temp = state.shoppingCart[i];
				if (temp.check) {
					/* 每遍历一次购物车商品列表，都会将单个商品的数量总数加起来 */
					totalNum += temp.num;
				}
			}
			return totalNum;
		},
		//结算支付金额
		getTotalPrice(state) {
			// 购物车勾选的商品总价格
			let totalPrice = 0;
			for (let i = 0; i < state.shoppingCart.length; i++) {
				const temp = state.shoppingCart[i];
				/* 单个商品的  价格和数量 不断相加 */
				if (temp.check) {
					totalPrice += temp.price * temp.num;
				}
			}
			return totalPrice;
		}
	},
	//更新数据
	mutations: {
		setShoppingCart(state, data) {
			// 设置购物车状态
			state.shoppingCart = data;
		},
		unshiftShoppingCart(state, data) {
			// 添加购物车
			// 用于在商品详情页点击添加购物车,后台添加成功后，更新vuex状态
			state.shoppingCart.unshift(data);
		},
		updateShoppingCart(state, payload) {
			// 用于购物车点击勾选及加减商品数量
			//console.log(payload)
			//会接收两种类型的数据 
			/* key: 1 prop: "num" val: 4 */
			/* key: 1 prop: "check" val: true */
			//判断是修改商品数量 还是商品勾选
			if (payload.prop == "num") {
				// 判断效果的商品数量是否大于限购数量或小于1
				//state.shoppingCart[payload.key]  找对应的第几个商品来判断  超过就不执行    通过遍历购物车的key做事， 找对应的属性来更新数据  
				if (state.shoppingCart[payload.key].maxNum < payload.val) {
					return;
				}
				if (payload.val < 1) {  //同理
					return;
				}
			}
			// 根据商品在购物车的数组的索引和属性更改   是勾选的切换  这里用id也是一样的 只要界面传递过来
			//找对应的索引商品  更新其checked
			state.shoppingCart[payload.key][payload.prop] = payload.val;
		},

		//添加购物车商品个数  我知道为什么要把一个商品的数据给拿过来了，是为了检测这个限制最大的购买数量，你就不能把id和最大的数量给过来吗，提高效率啊亲
		//仔细看了后，数据也不算太多，几个基础的信息而已
		addShoppingCartNum(state, productID) {
			// 增加购物车商品数量
			// 用于在商品详情页点击添加购物车,后台返回002，“该商品已在购物车，数量 +1”，更新vuex的商品数量
			for (let i = 0; i < state.shoppingCart.length; i++) {
				//找接收添加的id，有就加1 在没有超过限制前提下
				const temp = state.shoppingCart[i];
				if (temp.productID == productID) {
					if (temp.num < temp.maxNum) {
						temp.num++;
					}
				}
			}
		},
		//删除购物车的商品
		deleteShoppingCart(state, id) {
			// 根据购物车id删除购物车商品
			for (let i = 0; i < state.shoppingCart.length; i++) {
				const temp = state.shoppingCart[i];
				//找购物车删除时传递过来的id，把它从购物车的列表里删除
				if (temp.id == id) {
					state.shoppingCart.splice(i, 1); //一个参数，删除其后面的所有并返回新数组  两个参数，删除当前的这个索引值的数据，并返回
				}
			}
		},
		checkAll(state, data) {
			//console.log(data)
			// 点击全选按钮，更改每个商品的勾选状态
			/* 遍历购物车所有商品，修改他们的check为t/f */
			for (let i = 0; i < state.shoppingCart.length; i++) {
				state.shoppingCart[i].check = data;
			}
		}
	},
	//vuex的重点
	actions: {
		setShoppingCart({
			commit
		}, data) {
			commit('setShoppingCart', data);
		},
		//添加新的商品到购物车，一般应该是接收它的商品id，往后添加  这里把整个都作为一个对象加到购物车数组里？
		unshiftShoppingCart({
			commit
		}, data) {
			//console.log(data,'111')
			commit('unshiftShoppingCart', data);
		},
		//更新购物车状态
		updateShoppingCart({
			commit
		}, payload) {
			commit('updateShoppingCart', payload);
		},
		//添加购物车单个商品个数
		addShoppingCartNum({
			commit
		}, productID) {
			commit('addShoppingCartNum', productID);
		},
		//删除购物车商品
		deleteShoppingCart({
			commit
		}, id) {
			commit('deleteShoppingCart', id);
		},
		//全选
		checkAll({
			commit
		}, data) {
			commit('checkAll', data);
		}
	}
}
