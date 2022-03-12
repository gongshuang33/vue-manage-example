<template>
<el-container>
	<div>
		 <span>Welcome</span>
	</div>
</el-container>
	
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
	div {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%,-50%);
		width: 160px;
		height: 90px;
		text-align: center;
		border-radius: 10px;
		background: linear-gradient(145deg, rgb(66, 134, 198), rgb(112, 117, 191));
		box-shadow:  6px 6px 14px #cacaca,
             -6px -6px 14px #f6f6f6;
		span {
			line-height: 90px;
			font-size: 30px;
		}
	}
</style>