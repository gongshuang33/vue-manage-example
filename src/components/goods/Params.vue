<template>
	<el-container  style="height:90vh">
		<el-header>
			<!-- 面包屑导航区 -->
			<el-breadcrumb separator-class="el-icon-arrow-right">
				<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
				<el-breadcrumb-item>商品管理</el-breadcrumb-item>
				<el-breadcrumb-item>商品列表</el-breadcrumb-item>
			</el-breadcrumb>
		</el-header>
		<el-main style="margin-top:-30px;height:85%">
			<!-- 卡片视图区 -->
			<el-card style="margin-top: -20px">
				<!-- 警告区域 -->
				<el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false" :show-icon="true"></el-alert>
				<!-- 选择商品分类区域 -->
				<el-row class="cat_opt">
					<el-col>
						<span>选择商品分类：</span>
						<!-- 选择商品分类的级联选择框 -->
						<el-cascader style="width:300px"
							v-model="selectedCateKeys"
							:options="cateList"
							:props="cateProps"
							@change="handleChange">
						</el-cascader>
					</el-col>
				</el-row>
				<!-- tabs页签区 -->
				<el-tabs v-model="activeName" @tab-click="handleClick">
					<!-- 添加动态参数的面板 -->
					<el-tab-pane label="动态参数" name="many">
						<el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加参数</el-button>
						<!-- 动态参数表格 -->
						<el-table :data="manyTableData" border stripe>
							<el-table-column type="expand">
								<template slot-scope="scope">
									<el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">
										{{item}}
									</el-tag>
									<!-- 输入文本框 -->
									<el-input
										style="width: 200px;margin:15px 10px;"
										class="input-new-tag"
										v-if="scope.row.inputVisible"
										v-model="scope.row.inputValue"
										ref="saveTagInput"
										size="small"
										@keyup.enter.native="handleInputConfirm(scope.row)"
										@blur="handleInputConfirm(scope.row)"
									>
									</el-input>
									<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)" style="margin:15px 10px;">+ New Tag</el-button>
								</template>
							</el-table-column>
							<el-table-column type="index"></el-table-column>
							<el-table-column label="参数名称" prop="attr_name"></el-table-column>
							<el-table-column label="操作">
								<template slot-scope="scope">
									<el-button type="" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
									<el-button type="danger" icon="el-icon-search" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
								</template>
							</el-table-column>
						</el-table>
					</el-tab-pane>
					<!-- 添加静态属性的面板 -->
					<el-tab-pane label="静态属性" name="only">
						<el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加属性</el-button>
						<!-- 静态参数表格 -->
						<el-table :data="onlyTableData" border stripe>
							<el-table-column type="expand">
								<template slot-scope="scope">
									<el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">
										{{item}}
									</el-tag>
									<!-- 输入文本框 -->
									<el-input
										style="width: 200px;margin:15px 10px;"
										class="input-new-tag"
										v-if="scope.row.inputVisible"
										v-model="scope.row.inputValue"
										ref="saveTagInput"
										size="small"
										@keyup.enter.native="handleInputConfirm(scope.row)"
										@blur="handleInputConfirm(scope.row)"
									>
									</el-input>
									<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)" style="margin:15px 10px;">+ New Tag</el-button>
								</template>
							</el-table-column>
							<el-table-column type="index"></el-table-column>
							<el-table-column label="属性名称" prop="attr_name"></el-table-column>
							<el-table-column label="操作">
								<template slot-scope="scope">
									<el-button type="" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
									<el-button type="danger" icon="el-icon-search" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
								</template>
							</el-table-column>
						</el-table>
					</el-tab-pane>
				</el-tabs>
			</el-card>

			<!-- 添加参数对话框 -->
			<el-dialog
				:title="'添加'+titleText"
				:visible.sync="addDialogVisible"
				@close="addDialogClosed"
				width="50%">
				<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
					<el-form-item :label="titleText" prop="attr_name">
						<el-input v-model="addForm.attr_name"></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="addDialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="addParams">确 定</el-button>
				</span>
			</el-dialog>

			<!-- 编辑 对话框 -->
			<el-dialog
				:title="'修改'+titleText"
				:visible.sync="editDialogVisible"
				@close="editDialogClosed"
				width="50%">
				<el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
					<el-form-item :label="titleText" prop="attr_name">
						<el-input v-model="editForm.attr_name"></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="editDialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="editParams">确 定</el-button>
				</span>
			</el-dialog>

		</el-main>
	</el-container>
</template>

<script>
export default {
	data() {
		return {
			cateList: [],
			// 级联选择器配置对象
			cateProps: {
				value: 'cat_id',
				label: 'cat_name',
				children: 'children',
				expandTrigger: true 
			},
			// 级联选择框双向绑定的数组
			selectedCateKeys: [],
			// 绑定被激活的页签的名称
			activeName: 'many',
			// 动态参数数据
			manyTableData: [],
			// 静态参数数据
			onlyTableData: [],
			addDialogVisible: false,
			editDialogVisible: false,
			// 添加参数的表单数据对象
			addForm: {},
			addFormRef: {},
			editForm: {},
			// 添加表单验证规则对象
			addFormRules: {
				attr_name: [
					{ required: true, message: '请输入参数名称',trigger: 'blur'},
				]
			},
			editFormRules: {
				attr_name: [
					{ required: true, message: '请输入参数名称',trigger: 'blur'},
				]
			},
			

		}
	},
	created() {
		this.getCateList()
	},
	methods: {
		async getCateList() {
			const {data:res} = await this.$http.get('categories')
			if(res.meta.status !== 200)  return this.$message.error('获取商品分类失败')
			this.cateList = res.data
			// console.log(this.cateList)
		},
		// 级联选择框选中项变化会触发
		handleChange() {
			this.getParamsData()
		},
		// tab页签点击激活事件
		handleClick(){
			this.getParamsData()
		},
		// 获取参数列表数据
		async getParamsData() {
			if(this.selectedCateKeys.length !== 3) {
				this.selectedCateKeys = []
				this.manyTableData = []
				this.onlyTableData = []
				return 
			}
			const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{ params: { sel: this.activeName}})
			if(res.meta.status !== 200) return this.$message.error('参数获取失败')
			// console.log(res.data)
			res.data.forEach(item => {
				item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
				// 控制文本框显示与隐藏
				item.inputVisible = false
				item.inputValue = ''
			})
			if(this.activeName == 'many') {
				this.manyTableData = res.data
			} else {
				this.onlyTableData = res.data
			}
		},
		// 监听对话框关闭事件
		addDialogClosed() {
			this.$refs.addFormRef.resetFields()
		},
		// 点击“确定”按钮添加参数
		addParams() {
			this.$refs.addFormRef.validate(async valid => {
				if(!valid) return
				const {data: res} = await this.$http.post(`categories/${this.cateId}/attributes`,{
					attr_name: this.addForm.attr_name,
					attr_sel: this.activeName
				})
				if(res.meta.status !== 201) return this.$message.error('添加参数失败')

				this.$message.success('添加参数成功')
				this.addDialogVisible = false
				this.getParamsData()
			})
		},
		// 点击按钮展示编辑的对话框
		async showEditDialog(attr_id) {
			const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,{
				params: { attr_sel: this.activeName }
			})
			if(res.meta.status !== 200) return this.$message.error('获取参数信息失败')
			this.editForm = res.data
			this.editDialogVisible = true
		},
		editDialogClosed() {
			if(this.$refs.addFormRef !== undefined) {
				this.$refs.addFormRef.resetFields()
			}
		},
		// 点击按钮修改参数信息
		editParams() {
			this.$refs.editFormRef.validate(async valid => {
				if(!valid) return
				const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{
					attr_name: this.editForm.attr_name,
					attr_sel: this.activeName
				})
				if(res.meta.status !== 200) return this.$message.error('修改失败')
				this.$message.success('修改成功')
				this.getParamsData()
				this.editDialogVisible = false
			})
		},
		// 根据id删除参数信息
		async removeParams(attr_id){
			const confirmResult = await this.$confirm('此操作将永久删除参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
			if(confirmResult !== 'confirm') return this.$message.info('已取消操作')

			const {data: res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)

			if(res.meta.status !== 200) return hris.$message.error('删除参数失败')

			this.$message.success('删除参数成功')
			this.getParamsData()
			
		},
		// +tag 文本框失去焦点、按下回车执行
		handleInputConfirm(row) {
			if(row.inputValue.trim().length == 0) {
				row.inputValue = ''
				row.inputVisible = false
				return
			}
			// 如果没有return ，则证明输入内容合法，进行后续操作
			row.attr_vals.push(row.inputValue.trim())
			row.inputValue = ''
			row.inputVisible = false
			// 发起请求，保存数据
			this.saveAttrVals(row)
		},
		async saveAttrVals(row) {
			const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
				attr_name: row.attr_name,
				attr_sel: row.attr_sel,
				attr_vals: row.attr_vals.join(' ')
			})
			if(res.meta.status !== 200) return this.$message.error('修改失败')
			this.$message.success('修改参数项成功！')
		},
		showInput(row) {
			row.inputVisible = true
			// 自动获取焦点
			// EnextTick 方法的作用，当页面元素被重新渲染后后调用回调函数。
			this.$nextTick(_ => { 
				this.$refs.saveTagInput.$refs.input.focus();
			})
		},
		// 删除对应的参数可选项
		handleClose(i, row) {
			row.attr_vals.splice(i, 1)
			this.saveAttrVals(row)
		}

	},
	computed: {
		// 如果按钮需要被禁用，则返回true，否则返回false
		isBtnDisabled() {
			if(this.selectedCateKeys.length !== 3) {
				return true
			}
			return false
		},
		// 当前选中的三级分类的id
		cateId() {
			if(this.selectedCateKeys.length === 3) {
				return this.selectedCateKeys[2]
			}
			return null
		},
		// 动态计算标题文本
		titleText() {
			if(this.activeName === 'many') {
				return '动态参数'
			} else {
				return '静态属性'
			}
		},
		
	}
}
</script>

<style lang="less" scoped>
.cat_opt {
	margin: 15px 0;
}
.el-tag {
	margin : 15px 10px;
}

</style>