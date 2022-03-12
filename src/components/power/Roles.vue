<template>
	<el-container style="height:90vh">
		<el-header>
			<el-breadcrumb separator-class="el-icon-arrow-right" style="width:400px;margin-buttom:-20px">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
		</el-header>
		<el-main style="margin-top:-40px">
			<el-card>
				<el-row>
					<el-col>
						<el-button type="primary" @click="addRoleDialogVisible = true">添加角色</el-button>
					</el-col>
				</el-row>

				<!-- 角色列表 -->
				<el-table :data="roleList">
					<el-table-column type="expand">
						<template slot-scope="scope">
							<el-row :class="['bdbottom',index1 === 0 ? 'bdtop' : '']" v-for="(item1,index1) in scope.row.children" :key="item1.id"> 
								<!-- 一级权限 -->
								<el-col :span="5">
									<el-tag>{{item1.authName}}</el-tag>
									<i class="el-icon-caret-right"></i>
								</el-col>
								<!-- 二级和三级权限 -->
								<el-col :span="19">
									<!-- 通过for循环嵌套渲染 -->
									<el-row  :class="[index2 === 0 ? '' : 'bdtop']" v-for="(item2,index2) in item1.children" :key="item2.id">
										<el-col :span="6">
											<el-tag type="success" closable @close="rmRightsById(scope.row,item2.id)">{{item2.authName}}</el-tag>
											<i class="el-icon-arrow-right"></i>
										</el-col>
										<el-col :span="18">
												<el-tag :class="[index3 === 0 ? '' : 'bdtop']" v-for="(item3,index3) in item2.children" :key="item3.id" type="warning" closable @close="rmRightsById(scope.row,item3.id)">{{item3.authName}}</el-tag>
										</el-col>
									</el-row>
									
								</el-col>
							</el-row>
						</template>
					</el-table-column>
					<el-table-column type="index"></el-table-column>
					<el-table-column prop="roleName" label="名称"></el-table-column>
					<el-table-column prop="roleDesc" label="描述"></el-table-column>
					<el-table-column label="操作" width="300px">
						<template slot-scope="scope">
							<el-button size="small" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">编辑</el-button>
							<el-button size="small" type="danger" icon="el-icon-delete" @click="deleteRole(scope.row.id)">删除</el-button>
							<el-button size="small" type="warning" icon="el-icon-setting" @click="showSetRightById(scope.row)">分配权限</el-button>
						</template>
					</el-table-column>
				</el-table>

			</el-card>
      
			<!-- 分配权限对话框 -->
			<el-dialog
				title="分配权限"
				:visible.sync="dialogVisible"
				width="50%">
				<!-- 树形控件 -->
				<el-tree 
				show-checkbox 
				default-expand-all 
				node-key="id" 
				:data="rightsList" 
				:props="treeProps"
				:default-checked-keys="dfKeys" 
				ref = "treeRef"
				></el-tree>
				<span	pan slot="footer" class="dialog-footer">
					<el-button @click="dialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="allotRights">确 定</el-button>
				</span>
			</el-dialog>

			<!-- 添加角色对话框 -->
    <el-dialog
      title="新增角色"
      :visible.sync="addRoleDialogVisible"
      width="50%"
      @close="addCloseData"
    >
      <!-- 主体 -->
      <el-form
        :model="addRoleForm"
        ref="addRoleFormRef"
        label-width="120px"
      >
        <el-form-item label="角色名称：" prop="roleName">
          <el-input v-model="addRoleForm.roleName" placeholder="该项不可为空"></el-input>
        </el-form-item>
        <el-form-item label="角色描述：" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false"> 取 消 </el-button>
        <el-button type="primary" @click="addRole"> 确 定 </el-button>
      </span>
    </el-dialog>

		<!-- 编辑角色对话框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editRoleDialogVisible"
      width="50%"
      
    >
      <!-- 主体 -->
      <el-form
        :model="editRoleForm"
        ref="editRoleFormRef"
        label-width="70px"
      >
        <el-form-item label="角色名称">
          <el-input v-model="editRoleForm.roleName" placeholder="角色名不可为空"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false"> 取 消 </el-button>
        <el-button type="primary" @click="editRoleInfo"> 确 定 </el-button>
      </span>
    </el-dialog>


		</el-main>

	</el-container>
</template>

<script>
export default {
	data() {
		return {
			// 所有角色列表
			roleList:[],
			dialogVisible: false,
			rightsList: [],
			addRoleDialogVisible: false,
			editRoleDialogVisible: false,
			// 树形控件属性绑定对象
			treeProps: {
          children: 'children',
          label: 'authName'
        },
			dfKeys: [],
			// 当前即将分配权限的id
			roleId: '',
			addRoleForm: {},
			addRoleRef: {},
			editRoleForm: {}
		}
	},
	created() {
		// 获取角色列表
		this.getRoleList()
	},
	methods: {
		async getRoleList() {
			const {data:res} = await this.$http.get('roles')
			if(res.meta.status !== 200) return this.$message.error('获取列表失败')
			this.roleList = res.data
			// console.log(this.roleList)
		},
		async rmRightsById(role,rightId) {
			const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
			if(confirmResult !== 'confirm') {
				return this.$message.info('未删除')
			} 
			const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}` )
			if(res.meta.status !== 200) return this.$message.error('删除失败')
			this.$message.success('删除成功')
			role.children = res.data
		},
		// 展示分配权限的对话框
		async showSetRightById(role) {
			this.roleId = role.id
			const {data:res} = await this.$http.get('rights/tree')
			if(res.meta.status !== 200) return this.$message.error('获取失败')
			this.rightsList = res.data
			// 获取三级节点id
			this.dfKeys = []
			this.getLeafKeys(role,this.dfKeys)
			// console.log(this.dfKeys)
			this.dialogVisible = !this.dialogVisible
		},
		// 通过递归获取三级权限的目录id，并保存在dfKeys数组中
		getLeafKeys(node, arr) {
			if(!node.children) {
				return arr.push(node.id)	
			}
			node.children.forEach(item => {
				this.getLeafKeys(item, arr)})
		},
		// 为角色分配权限
		async allotRights() {
			const keys = [
				...this.$refs.treeRef.getCheckedKeys(),
			  ...this.$refs.treeRef.getHalfCheckedKeys()
			]	
			const idStr = keys.join(',')
			const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`,{ rids: idStr})
			if(res.meta.status !== 200) return this.$message.error('分配权限失败！')
			this.getRoleList()
			this.dialogVisible = false
			return this.$message.success('设置成功')
		},
		// 监听表单关闭
    addCloseData() {
      this.$refs.addRoleFormRef.resetFields()
    },
		// 验证角色是否存在(存在则返回true，不存在返回false)
		async roleExisted(name) {
			const {data:res} = await this.$http.get('roles')
			let roles = []
			for(var i of res.data) {
				roles.push(i.roleName)
			}
			for(var i = 0; i < roles.length; i++){
        if(name === roles[i]) return true
    	}
    	return false
		},
		// 添加角色
    async addRole() {
			// this.roleExisted(this.addRoleForm.roleName)
			var flag = false
			const {data:res1} = await this.$http.get('roles')
			let roles = []
			for(var i of res1.data) {
				roles.push(i.roleName)
			}
			for(var i = 0; i < roles.length; i++){
        if(this.addRoleForm.roleName === roles[i]) flag = true
    	}
			if(flag) {
				this.$message({
            type: "error",
            message:`角色【${this.addRoleForm.roleName}】已存在，不可重复添加！`,
          })
				return this.getRoleList()
			}
			const { data: res } = await this.$http.post("roles", this.addRoleForm)
			if (res.meta.status !== 201) return this.$message.error("添加失败")
			this.$message({
            type: "success",
            message:`添加角色【${this.addRoleForm.roleName}】成功`,
          })
			this.addRoleDialogVisible = false
			return this.getRoleList()
    },
		// 打开编辑角色对话框
		async showEditDialog(id) {
      this.editRoleDialogVisible = true
      const { data: res } = await this.$http.get("roles/" + id)
      if (res.meta.status != 200)
        return this.$message.error("发生未知错误了...555")
      this.editRoleForm = res.data
			// console.log(this.editRoleForm)
    },
		// 编辑角色
			async editRoleInfo() {
        const { data: res } = await this.$http.put(
          "roles/" + this.editRoleForm.roleId,
          { roleName: this.editRoleForm.roleName, roleDesc: this.editRoleForm.roleDesc }
        )
				// console.log(this.editRoleForm.roleId)
        if (res.meta.status !== 200) {
          return this.$message.error("角色更新失败")
        }
        //接下来， 关闭对话框、刷新数据列表、提示修改成功
        this.editRoleDialogVisible = false
        this.getRoleList()
        this.$message.success("更新成功")
      
    },
		// 删除角色
		async deleteRole(id) {
			const { data: res } = await this.$http.get("roles/" + id)
      if (res.meta.status != 200)
        return this.$message.error("发生未知错误了...555")
      const flag = await this.$confirm(
        `此操作将永久删除角色：【${res.data.roleName}】, 是否继续?`,
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
					const {data:res} = await this.$http.delete('roles/' + id)
					if(res.meta.status !== 200){
						return this.$message.error("删除角色失败")
					}
					this.getRoleList()
          this.$message.success("删除角色成功")
				}
    },
	}
}
</script>

<style lang="less" scoped>
.el-tag {
	margin: 10px;
}

.bdtop {
	border-top: 1px solid #eee;
}

.bdbottom {
	border-bottom: 1px solid #eee;
}
</style>