<template>
  <el-container style="height:85vh;">
   <el-header>
		  <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
	 </el-header>

    <el-main  style="margin-top:-30px">
			<!-- 卡片视图区 -->
    <el-card class="box-card">
      <!-- 搜索 添加区 -->

      <el-row :gutter="20">
        <el-col :span="3">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
        <el-col :span="8">
          <el-input
            placeholder="请输入用户名"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
            @change="getUserList"
          >
            <template slot="prepend">搜索</template>
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column label="用户名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template slot-scope="scope">
            <!--slot-scope 用来接收当前作用域的数据-->
            <!-- {{ scope.row }} -->
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#E6E6FA"
              @change="userStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-tooltip
              :open-delay="1000"
              :enterable="false"
              effect="light"
              content="修改"
              placement="left"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.id)"
              ></el-button
            ></el-tooltip>

            <!-- 分配角色按钮 -->
            <el-tooltip
              :open-delay="1000"
              :enterable="false"
              effect="light"
              content="分配角色"
              placement="top"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
								@click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>

            <!-- 删除按钮 -->
            <el-tooltip
              :open-delay="1000"
              :enterable="false"
              effect="light"
              content="删除"
              placement="top"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteUser(scope.row.id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[ 3, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
		

    <!-- 添加用户对话框 -->
    <el-dialog
      title="新增用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addCloseData"
    >
      <!-- 主体 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false"> 取 消 </el-button>
        <el-button type="primary" @click="addUser"> 确 定 </el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editCloseData"
    >
      <!-- 主体 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false"> 取 消 </el-button>
        <el-button type="primary" @click="editUserInfo"> 确 定 </el-button>
      </span>
    </el-dialog>
		<!-- 分配角色对话框 -->
		<el-dialog
			title="分配角色"
			:visible.sync="setRoleDialogVisible"
			width="50%">
			<div>
				<p>当前用户：{{userInfo.username}}</p>
				<p>当前角色：{{userInfo.role_name}}</p>
				<p>分配新角色
					<el-select v-model="selectRoleId" placeholder="请选择">
						<el-option
							v-for="item in roleList"
							:key="item.id"
							:label="item.roleName"
							:value="item.id">
						</el-option>
					</el-select>
				</p>
			</div>
			<span>
				<el-button @click="setRoleDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveRoleInfo">确 定</el-button>
			</span>
		</el-dialog>

		</el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    // 自定义验证邮箱规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error("请输入合法邮箱"))
    }
    // 自定义验证手机号规则
    var checkMobile = (rule, value, callback) => {
      const regMobile =
        /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error("请输入合法手机号"))
    }
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: "",
        pagenum: 1, // 当前页数
        pagesize: 5, // 每页展示多少条数据
      },
      userList: [],
      total: 0,
      addDialogVisible: false, // 添加用户的对话框  默认隐藏
      editDialogVisible: false,
			setRoleDialogVisible: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      editForm: {},
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度须为 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 12,
            message: "长度须为 6 到 12 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          { min: 11, max: 11, message: "请输入正确的手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      addFormRef: {},
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          { min: 11, max: 11, message: "请输入正确的手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
			// 需要被分配权限的用户信息
			userInfo: {},
			// 所有角色的数据列表
			roleList: [],
			// 已选中的角色id值
			selectRoleId: ''
			
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200)
        return this.$message.error("呜呜~获取列表失败了...")
      this.userList = res.data.users
      this.total = res.data.total
      // console.log(this.total, this.userList)
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听switch开关
    async userStateChange(userInfo) {
      // console.log(userInfo)
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error("更新用户状态失败")
      }
      // test
      return console.log("更新suer状态成功 操作时间：" + Date())
    },
    // 监听表单关闭
    addCloseData() {
      this.$refs.addFormRef.resetFields()
    },
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        // 表单预校验通过，发起添加用户的网络请求
        // console.log(this.addForm)
        const { data: res } = await this.$http.post("users", this.addForm)
        if (res.meta.status !== 201) this.$message.error("添加用户失败")
        this.$message.success("添加用户成功")
        this.addDialogVisible = false
        return this.getUserList()
      })
    },
    async showEditDialog(id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get("users/" + id)
      if (res.meta.status != 200)
        return this.$message.error("发生未知错误了...555")
      this.editForm = res.data
      // console.log(this.editForm)
    },
    editCloseData() {
      this.$refs.editFormRef.resetFields()
    },
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return // 预验证
        // 预验证通过，立即发起网络请求
        const { data: res } = await this.$http.put(
          "users/" + this.editForm.id,
          { email: this.editForm.email, mobile: this.editForm.mobile }
        )
        if (res.meta.status !== 200) {
          return this.$message.error("用户信息更新失败")
        }
        //接下来， 关闭对话框、刷新数据列表、提示修改成功
        this.editDialogVisible = false
        this.getUserList()
        this.$message.success("更新成功")
      })
    },
    async deleteUser(id) {
			const { data: res } = await this.$http.get("users/" + id)
      if (res.meta.status != 200)
        return this.$message.error("发生未知错误了...555")
      const flag = await this.$confirm(
        `此操作将永久删除用户：【${res.data.username}】, 是否继续?`,
        "提示",
				{
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
					}).catch(() => {
          // 捕获错误
          return this.$message({
            type: "info",
            message: "已取消操作",
          })
        })
				if(flag === "confirm") {
					const {data:res} = await this.$http.delete('users/' + id)
					if(res.meta.status !== 200){
						return this.$message.error("删除用户失败")
					}
					this.getUserList()
          this.$message.success("删除用户成功")
				}
    },
		async setRole(userInfo) {
			this.userInfo = userInfo

			// 在展示对话框前获取所有角色列表
			const {data: res} = await this.$http.get('roles')
			if(res.meta.status !== 200) return this.$message.error('获取角色列表失败')
			this.roleList = res.data
			this.setRoleDialogVisible = true
		},
		// 点击按钮，分配角色
		async saveRoleInfo() {
			if(!this.selectRoleId) {
				return this.$message.info('请选择分配的角色')
			}
			const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{
				rid: this.selectRoleId
			})
			if(res.meta.status !== 200) return this.$message.error('更新角色失败')
			this.getUserList()
			this.setRoleDialogVisible = false
			this.selectRoleId = ''
			return this.$message.success('更新角色成功')
		}
  },
}
</script>

<style lang="less" scoped></style>
