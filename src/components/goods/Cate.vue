<template>
	<el-container style="height:90vh">
		<el-header>
			<!-- 面包屑导航区 -->
			<el-breadcrumb separator-class="el-icon-arrow-right">
				<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
				<el-breadcrumb-item>商品管理</el-breadcrumb-item>
				<el-breadcrumb-item>商品分类</el-breadcrumb-item>
			</el-breadcrumb>
	 	</el-header>
		<el-main style="margin-top:-30px;height:85%">
			<el-card style="margin-top: -20px">
				<el-row style="margin-bottom:15px">
					<el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
				</el-row>
				
				<!-- 表格 -->
				<tree-table
				 :data="cateList"
				 :columns="columns"
				 :selection-type="false"
				 :expand-type="false"
				 show-index
				 border 
				 :show-row-hover="false" >
				 <!-- 是否有效 模板 -->
				 	<template slot="isok" slot-scope="scope" >
						 <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:#3CB371"></i>
						 <i class="el-icon-error" v-else style="color:#B22222"></i>
					</template>
				<!-- 排序 -->
					<template slot="order" slot-scope="scope">
						<el-tag size="mini" v-if="scope.row.cat_level == 0">一级</el-tag>
						<el-tag size="mini" v-else-if="scope.row.cat_level == 1" type="success">二级</el-tag>
						<el-tag size="mini" v-else type="warning">三级</el-tag>
					</template>
				<!-- 操作 -->
					<!-- <template slot="opt" slot-scope="scope"> -->
					<template slot="opt" >
						<el-button size="mini"  icon="el-icon-edit">编辑</el-button>
						<el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
					</template>
				</tree-table>
				
				 <!-- 添加商品分类对话框 -->
				<el-dialog
					title="添加分类"
					:visible.sync="addCateDialogVisible"
					width="50%"
					@close="addCateDialogClosed">
					<!-- 添加分类的表单 -->
					<el-form	form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px" >
						<el-form-item label="分类名称：" prop="cat_name">
							<el-input v-model="addCateForm.cat_name"></el-input>
						</el-form-item>
						<el-form-item label="父级分类：">
							<el-cascader
							style="width:100%"
								v-model="selectedKeys"
								:options="parentCateList" 
								:props="cascaderProps"
								@change="parentCateChange"
								:clearable="true"
								></el-cascader>
						</el-form-item>
					</el-form>

					<span slot="footer" class="dialog-footer">
						<el-button @click="addCateDialogVisible = false">取 消</el-button>
						<el-button type="primary" @click="addCate">确 定</el-button>
					</span>
				</el-dialog>


			</el-card>
		</el-main>
		<!-- 分页栏 -->
		<el-container style="margin-bottom:15px">
			<el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="querInfo.pagenum"
      :page-sizes="[3, 5, 10, 15]"
      :page-size="querInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    	</el-pagination>
		</el-container>

		
	</el-container>
	
</template>

<script>
export default {
	data() {
		return {
			cateList: [],
			// 查询条件
			querInfo: {
				type: 3,
				pagenum: 1,
				pagesize: 5
			},
			// 总数据条数
			total: 0,
			// 为table指定列的定义
			columns: [
				{
					label: '分类名称',
					prop: 'cat_name'
				},
				{
					label: '是否有效',
					type: 'template', // 表示当前列为模板列
					template: 'isok'  // 表示当前列使用的模板名称
				},
				{
					label: '分类排序',
					type: 'template',
					template: 'order'
				},
				{
					label: '操作',
					type: 'template',
					template: 'opt'
				}
			],
			addCateDialogVisible: false,
			// 添加分类的表单对象
			addCateForm: {
				cat_name: '',  // 分类名称
				cat_pid: '',  // 父分类id
				cat_level: 0  // 分类等级 
			},
			addCateFormRules: {
				cat_name: [
					{ required: true, message: "请输入分类名称", trigger: 'blur'},
				]
			},
			// 父级分类列表
			parentCateList: [],

			// 指定级联选择器de配置对象
			cascaderProps: {
				value: 'cat_id',
				label: 'cat_name',
				children: 'children',
				expandTrigger: "hover",
				checkStrictly: true
			},
			// 选中的父级id数组
			selectedKeys: [],
			
		}
	},
	created(){
		this.getCateList()
	},
	methods: {
		// 获取商品分类数据
		async getCateList(){
			const {data:res} = await this.$http.get('categories',{params: this.querInfo})
			if(res.meta.status !== 200) return this.$message.error('获取列表失败')
			// 保存数据列表
			this.cateList = res.data.result
			this.total = res.data.total
		},
		// 监听pagesize改变事件
		handleSizeChange(newSize) {
			this.querInfo.pagesize = newSize
			this.getCateList()
		},
		// 监听 pagenum的改变
		handleCurrentChange(newPage) {
			this.querInfo.pagenum = newPage
			this.getCateList()
		},
		// 点击按钮，展示添加分类的对话框
		showAddCateDialog() {
			// 先获取父级分类列表
			this.getParentCateList()
			this.addCateDialogVisible = true
		},
		// 获取父级分类列表
		async getParentCateList() {
				const {data:res} = await this.$http.get('categories',{params:{type: 2}})
				if(res.meta.status !== 200) return this.$message.error('获取父级列表失败')
				this.parentCateList = res.data
		},
		// 选择项发生变化触发
		parentCateChange() {
			// console.log(this.selectedKeys)
			// 如果selectedKey中的length大于0，证明选中了父级分类
			// 如果length>=1,则最后一项为父id
			if(this.selectedKeys.length > 0) {
				this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
				this.addCateForm.cat_level = this.selectedKeys.length
				return 
			} else {
				this.addCateForm.cat_pid = 0
				this.addCateForm.cat_level = 0
			}
		},
		// 点击按钮，添加分类
		addCate() {
		this.$refs.addCateFormRef.validate(async valid => {
			if(!valid) return
			const {data:res} = await this.$http.post('categories',this.addCateForm)
			if(res.meta.status !== 201) return this.$message.error('添加分类失败！')
			this.$message({
				type: 'success',
				message: `添加分类【${this.addCateForm.cat_name}】成功`
			})
			this.getCateList()
			this.addCateDialogVisible = false
		})
		},
		// 监听adddialog关闭,重置表单
		addCateDialogClosed() {
			this.$refs.addCateFormRef.resetFields()
			this.selectedKeys = []
			this.addCateForm.cat_level = 0
			this.addCateForm.cat_pid = 0
		}
	}
}
</script>

<style lang="less" scoped>

</style>