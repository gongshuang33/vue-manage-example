<template>
	<el-container style="height:90vh">
		<el-header>
			<!-- 面包屑导航区 -->
			<el-breadcrumb separator-class="el-icon-arrow-right">
				<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
				<el-breadcrumb-item>商品管理</el-breadcrumb-item>
				<el-breadcrumb-item>添加商品</el-breadcrumb-item>
			</el-breadcrumb>
	 	</el-header>

		 <el-main style="margin-top:-30px;height:85%">
			<el-card style="margin-top: -20px">
				<el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
				<el-steps :space="200" :active="activeIndex - 0"  finish-status="success" align-center>
					<el-step title="基本信息"></el-step>
					<el-step title="商品参数"></el-step>
					<el-step title="商品属性"></el-step>
					<el-step title="商品图片"></el-step>
					<el-step title="商品内容"></el-step>
					<el-step title="完成"></el-step>
				</el-steps>

				<!-- tab栏区 -->
				<el-form label-position="top"  :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
					<el-tabs v-model="activeIndex" tab-position="left" :before-leave="beforeTabLeave" @tab-click="tabCliked">
						<el-tab-pane label="基本信息" name="0">
							<el-form-item label="商品名称" prop="goods_name">
								<el-input v-model="addForm.goods_name"></el-input>
							</el-form-item>
							<el-form-item label="商品价格(元)" prop="goods_price">
								<el-input v-model="addForm.goods_price" type="number"></el-input>
							</el-form-item>
							<el-form-item label="商品重量" prop="goods_weight">
								<el-input v-model="addForm.goods_weight" type="number"></el-input>
							</el-form-item>
							<el-form-item label="商品数量" prop="goods_number">
								<el-input v-model="addForm.goods_number" type="number"></el-input>
							</el-form-item>
							<el-form-item label="商品分类" prop="goods_cat">
								<el-cascader
								v-model="addForm.goods_cat"
								:options="cateList"
								:props="cateProps"
								@change="handleChange"></el-cascader>
							</el-form-item>
						</el-tab-pane>
						<el-tab-pane label="商品参数" name="1">
							<el-form-item :label="item.attr_name" v-for="item in manyTableDate" :key="item.attr_id">
								<!-- 复选框 -->
									<el-checkbox-group v-model="item.attr_vals" >
										<el-checkbox border v-for="(cb, i) in item.attr_vals" :key="i"  :label="cb"></el-checkbox>
									</el-checkbox-group>
							</el-form-item>
						</el-tab-pane>
						<el-tab-pane label="商品属性" name="2">
							<el-form-item :label="item.attr_name" v-for="item in onlyTableDate" :key="item.attr_id">
								<el-input v-model="item.attr_vals"></el-input>
							</el-form-item>
						</el-tab-pane>
						<el-tab-pane label="商品图片" name="3">
							<!-- action 为图片上传请求地址 -->
							<el-upload :action="uploadURL"
								:on-preview="handlePreview"
								:on-remove="handleRemove"
								list-type="picture"
								:headers="headersObj"
								style="min-height:450px"
								:on-success="handelSuccess">
								<el-button size="small" type="primary">点击上传</el-button>
								<!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
							</el-upload>
						</el-tab-pane>
						<el-tab-pane label="商品内容" name="4">
							<quill-editor v-model="addForm.goods_introduce"></quill-editor>
							<el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
						</el-tab-pane>
					</el-tabs>
				</el-form>


			</el-card>

			<!-- 图片预览对话框 -->
			<el-dialog
				title="图片预览"
				:visible.sync="previewVisible"
				width="50%"
				@closed="previewPath=''">
				<img :src="previewPath" alt="预览图片" class="preImg">
			</el-dialog>

		</el-main>
	</el-container>
</template>

<script>
import _ from 'lodash'
export default {
	data() {
		return {
			activeIndex: '0',
			// 添加商品的表单对象
			addForm: {
				goods_name: '',
				goods_price: 0,
				goods_weight: 0,
				goods_number: 0,
				goods_cat: [],
				pics: [],
				goods_introduce: '',
				attrs:[]
			},
			addFormRules: {
				goods_name: [
					{ required: true, message: '请输入商品名称', trigger: 'blur'}
				],
				goods_price: [
					{ required: true, message: '请输入商品价格', trigger: 'blur'}
				],
				goods_weight: [
					{ required: true, message: '请输入商品重量', trigger: 'blur'}
				],
				goods_number: [
					{ required: true, message: '请输入商品数量', trigger: 'blur'}
				],
				goods_cat: [
					{ required: true, message: '请选择商品分类', trigger: 'blur'}
				],
			},
			cateList: [],
			cateProps: { 
				expandTrigger: 'hover' ,
				label: 'cat_name',
				value: 'cat_id',
				children: 'children'
			},
			// 动态参数列表数组
			manyTableDate:[],
			// 静态参数列表数组
			onlyTableDate:[],
			// 上传图片请求地址
			uploadURL: 'http://127.0.0.1:8881/api/private/v1/upload',
			// 图片上传headers请求头对象
			headersObj:{
				Authorization: window.sessionStorage.getItem('token')
			},
			// 图片预览地址
			previewPath: '',
			previewVisible: false
		}
	},
	created() {
		this.getCateList()
	},
	computed: {
		cateId() {
			if(this.addForm.goods_cat.length === 3){
				return this.addForm.goods_cat[2]
			}
			return null
		}
	},
	methods:{
		// 获取所有商品分类
		async getCateList() {
			const {data: res} = await this.$http.get('categories')
			if(res.meta.status !== 200) return this.$message.error('获取分类失败')
			this.cateList = res.data
			// console.log(this.cateList);
		},
		// 级联选择器选择性变化触发
		handleChange() {
			if(this.addForm.goods_cat.length !== 3) {
				this.addForm.goods_cat = []
			}
		},
		beforeTabLeave(activeName, oldActiveName) {
			if(oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
				this.$message.error('请先选择商品分类')
				return false
			}
		},
		async tabCliked() {
			if(this.activeIndex === '1') { // activeIndex = 1 ： 访问动态参数面板
				const {data:res}  = await this.$http.get(`categories/${this.cateId}/attributes`, {
					params: { sel: 'many'}
				})
				if(res.meta.status !== 200) {
					return this.$message.error('获取动态参数列表失败')
				}
				res.data.forEach(item => {
					item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
				})
				this.manyTableDate = res.data
			} else if (this.activeIndex === '2') { // activeIndex = 2 ： 访问动态参数面板
				const {data:res}  = await this.$http.get(`categories/${this.cateId}/attributes`, {
					params: { sel: 'only'}
				})
				if(res.meta.status !== 200) {
					return this.$message.error('获取静态参数列表失败')
				}
				// res.data.forEach(item => {
				// 	item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
				// })
				this.onlyTableDate = res.data
			}
		},
		// 处理图片预览
		handlePreview(file){
			this.previewPath = file.response.data.url
			this.previewVisible = true
		},
		// 处理移除图片操作
		handleRemove(file) {
			// 1. 获取将要删除的临时路径
			const fielPath = file.response.data.tmp_path
			// 2. 从pics数组中找到该图片对应的索引值
			const i = this.addForm.pics.findIndex(x => x.pic == fielPath)
			// 3. 调用数组的splice方法，吧图片的信息对象从pics数组中移除
			this.addForm.pics.splice(i,1)
		},
		// 监听图片上传成功
		handelSuccess(response) {
			// 1. 拼接得到图片信息对象
			// 2. push到图片数组中
			const picInfo = { pic: response.data.tmp_path }
			this.addForm.pics.push(picInfo)
		},
		add(){
			this.$refs.addFormRef.validate( async valid => {
				if(!valid) {
					return this.$message.error('请填写必要的表单项！')
				}
				// 预校验成功后的执行命令
				// 使用lodash  cloneDeep(obj)深拷贝一份儿addform
				const form =  _.cloneDeep(this.addForm)
				form.goods_cat = form.goods_cat.join(',')
				// 处理动态参数
				this.manyTableDate.forEach(item => {
					const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals.join(' ')}
					this.addForm.attrs.push(newInfo)
				})
				// 处理静态属性
				this.onlyTableDate.forEach(item => {
					const newInfo = { attr_id: item.attr_id,attr_value: item.attr_vals}
					this.addForm.attrs.push(newInfo)
				})
				form.attrs = this.addForm.attrs
				// 发起请求添加商品
				// 注意，商品名称必须唯一
				const {data:res} = await this.$http.post('goods', form)
				if(res.meta.status !== 201) {
					return this.$message({
						type: 'error',
						message: `添加失败，${res.meta.msg}`
					})
				}
				this.$message.success('商品添加成功！')
				this.$router.push('/goods')
			})
		}
	}
}
</script>

<style lang="less" scoped>
.el-checkbox {
	margin: 0 5px 0 0 !important;
}
.preImg {
	width: 100%;
}
.btnAdd {
	margin-top:15px;
	float: right;
}

</style>