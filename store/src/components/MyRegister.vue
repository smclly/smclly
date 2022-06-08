
<template>
	<!-- 饿了么form表单  注册验证的触发和验证规则都在里面 -->
  <div id="register">
    <el-dialog title="注册" width="300px" center :visible.sync="isRegister">
		<!-- 表单数据对象为注册用户的信息 验证规则为rules  是否在输入框中显示校验结果反馈图标--即在每次校验后会给出一个正确或错误的图标-->
      <el-form
        :model="RegisterUser"
        :rules="rules"
        status-icon
        ref="ruleForm"
        class="demo-ruleForm"
      >
        <el-form-item prop="name">  <!--  prop="name"在定义了 validate、resetFields 的方法时，该属性是必填的-->
          <el-input
            prefix-icon="el-icon-user-solid"
            placeholder="请输入账号"
            v-model="RegisterUser.name"
          ></el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input
            prefix-icon="el-icon-view"
            type="password"
            placeholder="请输入密码"
            v-model="RegisterUser.pass"
          ></el-input>
        </el-form-item>
        <el-form-item prop="confirmPass">
          <el-input
            prefix-icon="el-icon-view"
            type="password"
            placeholder="请再次输入密码"
            v-model="RegisterUser.confirmPass"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="medium" type="primary" @click="Register" style="width:100%;">注册</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "MyRegister",
  props: ["register"],
  data() {
    // 用户名的校验方法
	//通过动态绑定，给每一个数据都绑定了对应的验证规则，并且将其数据作为参数传递
    let validateName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入用户名"));
      }
      // 用户名以字母开头,长度在5-16之间,允许字母数字下划线
      const userNameRule = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/;
      if (userNameRule.test(value)) {  //test验证正则  符合注册条件
        //判断数据库中是否已经存在该用户名
        this.$axios
          .post("/api/users/findUserName", {
            userName: this.RegisterUser.name  //把输入的用户名发送过去查找
          })
          .then(res => {						//异步查询，返回promsie，根据返回结果调用对应的函数
            // “001”代表用户名不存在，可以注册
            if (res.data.code == "001") {
              this.$refs.ruleForm.validateField("checkPass");  // ref="ruleForm" ref标签
              return callback();
            } else {											//已存在，就返回一个错误信息
              return callback(new Error(res.data.msg));
            }
          })
          .catch(err => {
            return Promise.reject(err);			//捕获错误
          });
      } else {
        return callback(new Error("字母开头,长度5-16之间,允许字母数字下划线"));   //不符合条件
      }
    };
    // 密码的校验方法
    let validatePass = (rule, value, callback) => {
		//密码为空
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
    // 确认密码的校验方法
    let validateConfirmPass = (rule, value, callback) => {
		//密码为空
      if (value === "") {
        return callback(new Error("请输入确认密码"));
      }
      // 校验是否以密码一致
      if (this.RegisterUser.pass != "" && value === this.RegisterUser.pass) {
        this.$refs.ruleForm.validateField("checkPass");
        return callback();
      } else {
        return callback(new Error("两次输入的密码不一致"));
      }
    };
    return {
      isRegister: false, // 控制注册组件是否显示
      RegisterUser: {
        name: "",
        pass: "",
        confirmPass: ""
      },
      // 用户信息校验规则,validator(校验方法),trigger(触发方式),blur为在组件 Input 失去焦点时触发
      rules: {
        name: [{ validator: validateName, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }],
        confirmPass: [{ validator: validateConfirmPass, trigger: "blur" }]
      }
    };
  },
  watch: {
    // 监听父组件传过来的register变量，设置this.isRegister的值
    register: function(val) {  //不用监听数据，通过data接收，然后接收到的是一个字符串，点击注册时就改变了它的状态值，为true 
      if (val) {
        this.isRegister = val;
		//console.log(val)  //true
      }
    },
	//在点击注册时就已经被修改
    // 监听this.isRegister变量的值，更新父组件register变量的值
    isRegister: function(val) {
		//注册成功后，状态被修改，注册框被隐藏， 这个时候，就需要清空校验框
      if (!val) {
        this.$refs["ruleForm"].resetFields();  //重置该表单项，将其值重置为初始值，并移除校验结果
        this.$emit("fromChild", val);  //自定义事件  将修改后的false状态通过自定义事件提交
      }
    }
  },
  methods: {
	//注册的函数
    Register() {
      // 通过element自定义表单校验规则，校验用户输入的用户信息
      this.$refs["ruleForm"].validate(valid => {  //valid 看做是前面校验成功的值
        //如果通过校验开始注册
        if (valid) {
          this.$axios
            .post("/api/users/register", {
              userName: this.RegisterUser.name,
              password: this.RegisterUser.pass
            })
            .then(res => {
              // “001”代表注册成功，其他的均为失败
              if (res.data.code === "001") {
                // 隐藏注册组件
                this.isRegister = false;  //修改this.isRegister的状态
                // 弹出通知框提示注册成功信息
                this.notifySucceed(res.data.msg);
              } else {
                // 弹出通知框提示注册失败信息
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