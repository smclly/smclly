<template>
	<div id="myLogin">
		<!-- :visible.sync="isLogin" 控制是否显示登录组件    status-icon是否在输入框中显示校验结果反馈图标-->
		<el-dialog title="登录" width="300px" center :visible.sync="isLogin">
			<el-form :model="LoginUser" :rules="rules" status-icon ref="ruleForm" class="demo-ruleForm">
				<el-form-item prop="name">
					<el-input prefix-icon="el-icon-user-solid" placeholder="请输入账号" v-model="LoginUser.name"></el-input>
				</el-form-item>
				<el-form-item prop="pass">
					<el-input prefix-icon="el-icon-view" type="password" placeholder="请输入密码" v-model="LoginUser.pass">
					</el-input>
				</el-form-item>
				<el-form-item>
					<el-button size="medium" type="primary" @click="Login" style="width:100%;">登录</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>
<script>
	import {
		mapActions
	} from "vuex";

	export default {
		name: "MyLogin",
		data() {
			// 用户名的校验方法
			let validateName = (rule, value, callback) => {
				if (!value) {
					return callback(new Error("请输入用户名"));
				}
				// 用户名以字母开头,长度在5-16之间,允许字母数字下划线
				const userNameRule = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/;
				if (userNameRule.test(value)) {
					this.$refs.ruleForm.validateField("checkPass");
					//console.log(this) vue实例对象，因为是箭头函数，没有this
					return callback();
				} else {
					return callback(new Error("字母开头,长度5-16之间,允许字母数字下划线"));
				}
			};
			// 密码的校验方法
			let validatePass = (rule, value, callback) => {
				if (value === "") {
					return callback(new Error("请输入密码"));
				}
				// 密码以字母开头,长度在6-18之间,允许字母数字和下划线
				const passwordRule = /^[a-zA-Z]\w{5,17}$/;
				if (passwordRule.test(value)) {
					this.$refs.ruleForm.validateField("checkPass");
					return callback();
				} else {
					return callback(
						new Error("字母开头,长度6-18之间,允许字母数字和下划线")
					);
				}
			};
			return {
				LoginUser: {
					name: "",
					pass: ""
				},
				// 用户信息校验规则,validator(校验方法),trigger(触发方式),blur为在组件 Input 失去焦点时触发
				rules: {
					name: [{
						validator: validateName,
						trigger: "blur"
					}],
					pass: [{
						validator: validatePass,
						trigger: "blur"
					}]
				}
			};
		},
		computed: {
			// 获取vuex中的showLogin，控制登录组件是否显示  已经在父组件点击登录时将状态修改为true
			//计算属性，一个get和set，有修改就进行修改的步骤 默认为false
			isLogin: {
				get() {
					return this.$store.getters.getShowLogin;
				},
				set(val) {
					//点击登录的第一时间，清除掉之前的校验信息，然后将true作为参数传递，并且显示登录组件
					this.$refs["ruleForm"].resetFields();
					this.setShowLogin(val);
				}
			}
		},
		methods: {
			...mapActions(["setUser", "setShowLogin"]),
			Login() {
				// 通过element自定义表单校验规则，校验用户输入的用户信息
				this.$refs["ruleForm"].validate(valid => {
					//如果通过校验开始登录
					if (valid) {
						this.$axios
							.post("/api/users/login", {
								userName: this.LoginUser.name,
								password: this.LoginUser.pass
							})
							.then(res => {
								// “001”代表登录成功，其他的均为失败
								if (res.data.code === "001") {
									// 隐藏登录组件
									this.isLogin = false;
									// 登录信息存到本地
									let user = JSON.stringify(res.data.user);
									localStorage.setItem("user", user);
									// 登录信息存到vuex
									this.setUser(res.data.user);
									//console.log(user)
									//console.log(res)
									//this.$store.dispatch('setUser', res.data.user)

									// 弹出通知框提示登录成功信息
									this.notifySucceed(res.data.msg);
								} else {
									// 清空输入框的校验状态
									this.$refs["ruleForm"].resetFields();
									// 弹出通知框提示登录失败信息
									this.notifyError(res.data.msg);
								}
							})
							.catch(err => {
								return Promise.reject(err);
							});
					} else {
						return false;
					}
				});
			}
		}
	};
</script>
<style>
</style>
