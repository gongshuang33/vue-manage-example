<template>
	<el-container  style="height:90vh">
		<el-header>
			<!-- 面包屑导航区 -->
			<el-breadcrumb separator-class="el-icon-arrow-right">
				<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
				<el-breadcrumb-item>订单管理</el-breadcrumb-item>
				<el-breadcrumb-item>订单列表</el-breadcrumb-item>
			</el-breadcrumb>
	 	</el-header>

		 <el-main style="margin-top:-30px;height:85%">
			<el-card style="margin-top: -20px">
				<el-row>
					<el-col :span="8">
					<el-input placeholder="请输入内容" v-model="queryInfo.query">
						<el-button slot="append" icon="el-icon-search"></el-button>
					</el-input>
				</el-col>
				</el-row>
				<!-- 订单列表数据 -->
				<el-table :data="orderList" border stripe>
					<el-table-column type="index" label="#" align="center"></el-table-column >
					<el-table-column label="订单编号" prop="order_number" align="center"></el-table-column>
					<el-table-column label="订单价格" prop="order_price" width="100px" align="center"></el-table-column>
					<el-table-column label="是否付款" prop="pay_status" width="110px" align="center">
						<template slot-scope="scope">
							<el-tag size="small" v-if="scope.row.pay_status === '1'" type="success">已付款</el-tag>
							<el-tag size="small" v-else type="danger">未付款</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="是否发货" prop="is_send" width="110px" align="center"></el-table-column>
					<el-table-column label="下单时间" prop="create_time" width="200px" align="center">
						<template slot-scope="scope">
							{{scope.row.create_time | dateFormat}}
						</template>
					</el-table-column>
					<el-table-column label="操作"  align="center" width="200px">
						<template slot-scope="scope">
							<el-button size="mini" type="primary" icon="el-icon-edit" @click="showBox">

							</el-button>
							<el-button size="mini" :disabled="scope.row.is_send === '否' ? true : false" type="success" icon="el-icon-location" @click="showProgressBox"></el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-card>

			<!-- 修改地址对话框 -->
			<el-dialog
				title="修改地址"
				:visible.sync="addressDialogVisible"
				width="50%"
				:before-close="handleClose"
				@close="addressDialogClosed">
				<el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px" >
					<el-form-item label="省市区/县" prop="address1">
						<el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
					</el-form-item>
					<el-form-item label="详细地址" prop="address2">
						<el-input v-model="addressForm.address2"></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="addressDialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="addressDialogVisible = false">确 定</el-button>
				</span>
			</el-dialog>
		</el-main>

			<!--展示物流进度的对话框 -->
			<el-dialog
				title="物流进度"
				:visible.sync="progressVisible"
				width="50%">
				<el-timeline>
					<el-timeline-item
						v-for="(activity, index) in progressInfo"
						:key="index"
						:timestamp="activity.time">
						{{activity.context}}
					</el-timeline-item>
				</el-timeline>
				<span slot="footer" class="dialog-footer">
					<el-button @click="progressVisible = false">取 消</el-button>
					<el-button type="primary" @click="progressVisible = false">确 定</el-button>
				</span>
			</el-dialog>

		<el-container style="margin-bottom:15px">
					<!-- 底部分页 -->
					<el-pagination
						background
						@size-change="handleSizeChange"
						@current-change="handleCurrentChange"
						:current-page="queryInfo.pagenum"
						:page-sizes="[8, 10, 20, total]"
						:page-size="queryInfo.pagesize"
						layout="total, sizes, prev, pager, next, jumper"
						:total="total">
					</el-pagination>
			</el-container>
	<!-- </el-container> -->

	</el-container>
</template>

<script>
import cityData from './citydata.js';
export default {
	data(){
		return {
			// 查询对象
			queryInfo: {
				query: '',
				pagenum: 1,
				pagesize: 8,
			},
			total: 0,
			orderList: [],
			addressDialogVisible: false,
			addressForm: {
				address1: [],
				address2: ''
			},
			addressFormRules: {
				address1: [
					{ required: true, message: "请选择省市区/县", trigger: 'blur'}
				],
				address2: [
					{ required: true, message: "请填写详细地址", trigger: 'blur'}
				]
			},
			cityData: cityData,
			progressVisible: false,
			progressInfo: []

		}
	},
	created() {
		this.getOrderList()
	},
	methods: {
		async getOrderList() {
			const {data: res} = await this.$http.get('orders', { params: this.queryInfo})
			if(res.meta.status !== 200) {
				return this.$message.error('获取列表失败')
			}
			this.total = res.data.total
			this.orderList = res.data.goods
		},
		handleSizeChange(newSize) {
			this.queryInfo.pagesize = newSize
			this.getOrderList()
		},
		handleCurrentChange(newPage) {
			this.queryInfo.pagenum = newPage
			this.getOrderList()
		},
		// 展示修改地址对话框
		showBox() {
			this.addressDialogVisible = true
		},
		handleClose() {
			this.addressDialogVisible = false
		},
		addressDialogClosed() {
			this.$refs.addressFormRef.resetFields()
		},
		async showProgressBox() {
			// 物流接口失效
			// const {data:res} = await  this.$http.get(`/kuaidi/1106975712662`)
			// if(res.meta.status !== 200) {
			// 	this.$message.error('获取物流失败')
			// }
			// this.progressInfo = res.data
			// 手动添加测试数据
			this.progressInfo = [
				{
					"time": "2022-2-10 09:39:00",
					"ftime": "2022-2-10 09:39:00",
					"context": "已签收,感谢使用顺丰,期待再次为您服务",
					"location": ""
				},
				{
					"time": "2022-2-10 08:23:00",
					"ftime": "2022-2-10 08:23:00",
					"context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
					"location": ""
				},
				{
					"time": "2022-2-10 07:32:00",
					"ftime": "2022-2-10 07:32:00",
					"context": "快件到达 [北京海淀育新小区营业点]",
					"location": ""
				},
				{
					"time": "2022-2-10 02:03:00",
					"ftime": "2022-2-10 02:03:00",
					"context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
					"location": ""
				},
				{
					"time": "2022-2-09 23:05:00",
					"ftime": "2022-2-09 23:05:00",
					"context": "快件到达 [北京顺义集散中心]",
					"location": ""
				},
				{
					"time": "2022-2-09 21:21:00",
					"ftime": "2022-2-09 21:21:00",
					"context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
					"location": ""
				},
				{
					"time": "2022-2-09 13:07:00",
					"ftime": "2022-2-09 13:07:00",
					"context": "顺丰速运 已收取快件",
					"location": ""
				},
				{
					"time": "2022-2-09 12:25:03",
					"ftime": "2022-2-09 12:25:03",
					"context": "卖家发货",
					"location": ""
				},
				{
					"time": "2022-2-09 12:22:24",
					"ftime": "2022-2-09 12:22:24",
					"context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
					"location": ""
				},
				{
					"time": "2022-2-08 21:36:04",
					"ftime": "2022-2-08 21:36:04",
					"context": "商品已经下单",
					"location": ""
				}
			],
			this.progressVisible = true
		}
	}
}
</script>

<style lang="less" scoped>
.el-cascader {
	width: 100%;
}
</style>