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
				<el-row :gutter="20">
					<el-col :span="8">
						<el-input placeholder="请输入内容" v-model="queryInfo.query" clearable>
							<el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
						</el-input>
					</el-col>
					<el-col :span="4" >
						<el-button type="primary" @click="goAddpage">添加商品</el-button>
					</el-col>
				</el-row>

				<!-- table 区 -->
				<el-table :data="goodsList" border stripe>
					<el-table-column type="index" label="#"></el-table-column>
					<el-table-column label="商品名称" prop="goods_name"></el-table-column>
					<el-table-column label="商品价格(元)" prop="goods_price" width="100px"></el-table-column>
					<el-table-column label="商品重量" prop="goods_weight" width="80px"></el-table-column>
					<el-table-column label="创建时间" prop="add_time" width="150px">
						<template slot-scope="scope">
							{{scope.row.add_time | dateFormat}}
						</template>
					</el-table-column>
					<el-table-column label="操作" width="130px">
						<template slot-scope="scope">
							<el-button size="mini" type="primary" icon="el-icon-edit" ></el-button>
						<el-button size="mini" type="danger" icon="el-icon-delete" @click="removeById(scope.row.goods_id)"></el-button>
						</template>
					</el-table-column>
				</el-table>

				

			</el-card>
		</el-main>

		<el-container style="margin-bottom:15px">
					<!-- 底部分页 -->
					<el-pagination
						background
						@size-change="handleSizeChange"
						@current-change="handleCurrentChange"
						:current-page="queryInfo.pagenum"
						:page-sizes="[6, 10, 15, 20, 50, total]"
						:page-size="queryInfo.pagesize"
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
			// 查询参数对象
			queryInfo:{
				query: '',
				pagenum: 1,
				pagesize: 6
			},
			// 商品列表
			goodsList: [],
			// 总数条数
			total: 0,
		}
	},
	created() {
		this.getGoodsList()
	},
	methods: {
		// 根据分页获取相应当为参数列表
		async getGoodsList() {
			const {data:res} = await this.$http.get('goods',{ params: this.queryInfo })
			if(res.meta.status !== 200) return this.$message.error('获取列表失败')
			this.goodsList = res.data.goods
			this.total = res.data.total
		},
		handleSizeChange(newSize) {
			this.queryInfo.pagesize = newSize
			this.getGoodsList()
		},
		handleCurrentChange(newPage) {
			this.queryInfo.pagenum = newPage
			this.getGoodsList()
		},
		async removeById(id) {
			const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).catch(err => err)
			if(confirmResult !== 'confirm') {
				return this.$message.info('已取消操作')
			}
			const {data:res} = await this.$http.delete(`goods/${id}`)
			if(res.meta.status !== 200) {
				return this.$message.error('删除失败')
			}
			this.$message.success('删除成功！')
			this.getGoodsList()
		},
		goAddpage() {
			this.$router.push('/goods/add')
		}
	}
}
</script>

<style lang="less" scoped>

</style>