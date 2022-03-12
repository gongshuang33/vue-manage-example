<template>

<el-container style="height:800px;">
	<el-header>
		<el-breadcrumb separator-class="el-icon-arrow-right" style="width:400px;margin-buttom:-20px">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
	</el-header>
  <el-main style="margin-top:-20px">
    <el-card  style="margin-top: -20px">
			 <el-table :data="rightsList" border  style="margin-top: -2px" >
				  <el-table-column type="index" label="序号"></el-table-column>
				  <el-table-column label="权限名称" prop="authName"></el-table-column>
				  <el-table-column label="路径" prop="path"></el-table-column>
				  <el-table-column label="权限层级" prop="level">
						<template slot-scope="scope">
							<el-tag v-if="scope.row.level === '0'">一级</el-tag>
							<el-tag v-if="scope.row.level === '1'" type="success">二级</el-tag>
							<el-tag v-if="scope.row.level === '2'" type="warning">三级</el-tag>
						</template>
						
					</el-table-column>

			 </el-table>
			  <el-pagination
    layout="prev, pager, next"
    :total="50">
  </el-pagination>
		</el-card>
	</el-main>
	</el-container>
</template>

<script>
export default {
  data() {
    return {
			// 权限列表
			rightsList: []
		}
  },
	created() {
		this.getRightsList()
	},
	methods: {
		async getRightsList() {
			const {data:res} = await this.$http.get("rights/list")
			if(res.meta.status !== 200) return this.$message.error("获取权限列表失败")
			this.rightsList = res.data
			// console.log(this.rightsList);

		}
	}
}
</script>

<style lang="less" scoped></style>
