<template>
<el-container style="width:1262px;">
    <el-header style="width:1262px;
                background-color: #B3C0D1;
                color: #000000;
                text-align: left;
                line-height: 60px;">
        您好！欢迎访问智慧工地标准系统官网！
    </el-header>
    <el-image
        style="width:442px;
            height: 50px;"
        src="../../static/logo.png"
        fit="fill">
    </el-image>
    <el-image
        style="width:1262px;
            height: 369px;"
        src="../../static/backgroundpic.png"
        fit="fill">
    </el-image>

</el-container>
</template>

<script>
export default {
    name:"Header",
}
</script>

<style>
  .el-footer {
    background-color: #B3C0D1;
    color: #000000;
    text-align: left;
    line-height: 60px;
  }
  body > .el-container {
    margin-bottom: 40px;
  }
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }

</style>