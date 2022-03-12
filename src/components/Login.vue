<template>
  <div class="login-container">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" class="login_icon" />
      </div>
      <!-- 登录表单区 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        label-width="0px"
        class="login_form"
        :rules="loginFormRules"
      >
        <!-- username -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <!-- password -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <!-- button -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录表单数据绑定对象
      loginForm: {
        username: "admin", // 默认用户名、密码
        password: "123456",
      },
      // 表单验证规则
      loginFormRules: {
        username: [
          // 验证用户名是否合法
          { required: true, message: "此项不可为空", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          // 验证密码是否合法
          { required: true, message: "此项不可为空", trigger: "blur" },
          {
            min: 6,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: "blur",
          },
        ],
      },
    }
  },
  methods: {
    resetForm() {
      // 重置表单数据。
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      // 预验证  valid为 true：通过，false：失败
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        //发起登录请求
        const { data: res } = await this.$http.post("login", this.loginForm)
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error("登录失败 请检查用户名和密码")
        else {
          this.$message.success('登录成功')
					// 登录成功后的操作：
						// 1．将登录成功之后的 token，保存到客户端的sessionStorage中
						//1.1项目中出了登录之外的其他PI接口，必须在登录之后才能访问
						//1.2 token 只应在当前网站打开期间生效，所以将 token保存在 sessionStorage中
					window.sessionStorage.setItem("token",res.data.token)
					// 2．通过编程式导航跳转到后台主页，路由地址是/home
					this.$router.push('/home')


        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.login-container {
  // background-color: #243b55;
	// background-color: rgb(58, 58, 104);
	background: #77A1D3;  /* fallback for old browsers */
background: -webkit-linear-gradient(to right, #77A1D3,rgb(62, 62, 139) );  /* Chrome 10-25, Safari 5.1-6 */
background: linear-gradient(to right, #77A1D3,rgb(62, 62, 139)); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  height: 100%;
}
.login_box {
  width: 400px;
  height: 270px;
  background-color: white;
  border-radius: 2%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.avatar_box {
  height: 100px;
  width: 100px;
  background-color: #eee;
  border: 5px solid #eee;
  border-radius: 50%;
  box-shadow: 0 0 20px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  .login_icon {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
	:hover {
		box-shadow: 0 0 25px  rgb(227, 133, 174);
	}
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
