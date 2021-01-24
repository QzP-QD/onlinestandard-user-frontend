<template>
<el-container style="width:1262px;"
    direction="vertical">
    <Header></Header>
    <h1>合并标准文档</h1>
    <el-container>
        {{mylist}}
    </el-container>
</el-container>
</template>

<script>
export default {
    name:"MergeStandard",
    data(){
        return{
            mylist:[]
        }
    },
    mounted(){
        var templist = this.$route.params
        this.mylist = templist.mylist

        // 根据id列表获取标准内容
    },
    methods:{

    }

}
</script>

<style>

</style>