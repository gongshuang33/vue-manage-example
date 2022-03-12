<template>
  <el-container class="home_container"  style="overflow:hidden;" >
    <!-- 头部 -->
    <el-header>
      <div>
				<img src="../assets/img/icon_f.png" alt="icon" />
				<span>电商后台管理系统</span>
			</div>
			<el-button @click="logout" size="small">退出</el-button>
    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <!-- 左栏 -->
      <el-aside :width="isFold ? '200px' : '64px'">
        <div class="toggle_button" @click="changeFold">
          <i v-if="isFold" class="el-icon-s-fold"></i>
          <i v-if="!isFold" class="el-icon-s-unfold"></i>
        </div>
        <el-menu
					class="elMenu"
          unique-opened
          text-color="#fff"
          active-text-color="#696969"
          :collapse="!isFold"
          :collapse-transition="false"
          router
          :default-active="this.activePath"
        >
          <el-submenu
            :index="item.id.toString()"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconsObj[item.id]" style="color: #eee"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
						
              :index="'/' + i.path"
              v-for="i in item.children"
              :key="i.id"
              @click="savePath(i.path)"
            >
              <i class="el-icon-menu"></i>
              <span>{{ i.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主显示区域 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [], // 从服务器获取的左侧菜单数据
      iconsObj: {
        125: "el-icon-s-custom",
        103: "el-icon-s-cooperation",
        101: "el-icon-s-shop",
        102: "el-icon-s-order",
        145: "el-icon-s-data",
      },
      isFold: true,
      activePath: "",
    }
  },
  created() {
    this.getMenuList()
    this.activePath =  window.sessionStorage.getItem("activePath")
  },
  methods: {
    logout() {
      // 1. 点击退出登录后，清除token
      window.sessionStorage.clear()
      // 2. 重定向到登录页
      // this.$message.success("已退出")
      return this.$router.push("/login")
    },
    async getMenuList() {
      const { data: res } = await this.$http.get("menus")
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
      // console.log(res)
      // console.log(this.menuList)
    },
    changeFold() {
      this.isFold = !this.isFold
    },
    savePath(path) {
      window.sessionStorage.setItem("activePath", '/' + path)
      this.activePath = window.sessionStorage.getItem("activePath")
    },
  },
}
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
}
.el-header {
  // background-color: #434343;
background: #7474BF;  /* fallback for old browsers */
background: -webkit-linear-gradient(to right, #348AC7, #7474BF);  /* Chrome 10-25, Safari 5.1-6 */
background: linear-gradient(to right, #348AC7, #7474BF); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  display: flex;
  justify-content: space-between;
  align-items: center;
  div{
		position: relative;
		height: 100%;
		img {
			height: 130%;
			position: relative;
			top: 50%;
			transform: translate(0,-50%);
  	}
		span {
			color: #fff;
			font-weight: bold;
			font-size: 130%;
			display: inline-block;
			width: 500px;
			position: absolute;
			top:50%;
			transform: translate(0,-50%);
			left: 80px;
		}
	}
  
}
.el-aside {
  // background-color: rgb(49, 55, 67);
background: rgb(235, 126, 140);  /* fallback for old browsers */

}
.el-main {
  // background-color: #eee;
	background-color: rgb(227, 250, 250);
}
.el-menu {
  border-right: 0;
	.el-menu-item {
		background: rgb(235, 126, 140) !important;
		
	}
}
.toggle_button {
  // background-color: rgb(71, 81, 98);
background: rgb(116, 116, 191);  /* fallback for old browsers */

  i {
    color: #eee;
    margin-left: 50%;
    transform: translate(-50%, 0);
    font-size: 130%;
  }
}
.elMenu{
background: rgb(235, 126, 140);  /* fallback for old browsers */
// font-weight:600;
}
</style>
