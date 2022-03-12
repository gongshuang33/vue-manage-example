<template>
	<el-container style="height:90vh">
		<el-header>
			<!-- 面包屑导航区 -->
			<el-breadcrumb separator-class="el-icon-arrow-right">
				<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
				<el-breadcrumb-item>数据统计</el-breadcrumb-item>
				<el-breadcrumb-item>数据报表</el-breadcrumb-item>
			</el-breadcrumb>
	 	</el-header>

		 <el-main style="margin-top:-30px;height:85%">
			<el-card style="margin-top: -20px">
				 <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
				<div id="main" style="width: 100%;height:400px;"></div>
			</el-card>
		 </el-main>
	</el-container>
</template>

<script>
import * as echarts from 'echarts'
import _ from 'lodash'
export default {
	data() {
		return {
			// 需要合并的对象
			options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
		}
	},
	created() {

	},
	// mounted函数执行时，表示dom已经渲染完毕
	async mounted() {
		// 基于准备好的dom，初始化echarts实例
		var myChart = echarts.init(document.getElementById('main'));

		const {data: res} = await this.$http.get('reports/type/1')
		if(res.meta.status !== 200) {
			return this.$message.error('获取数据失败')
		}	
		const result = _.merge(res.data,this.options)
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(result)
	},
	methods: {

	}
}
</script>

<style lang="less" scoped>

</style>