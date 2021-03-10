<template>
<el-container style="width:1262px;"
    direction="vertical">
    <Header
        @click.native="jumpToMainPage">
    </Header>
    <el-button
        @click="downloadFile">
        下载合并文档
    </el-button>
    <div id="exportPdf" ref="exportPdf">
    <el-container direction="vertical">
        <div 
            style="
                display:flex;
                width:1262px;">
            <h1>合并标准文档</h1>
        </div>
        <div
            v-for="(firstl, index1) in firstLevels"
            :key=index1>
            <h1>{{firstl}}</h1>
            <div 
                v-for="(secondl, index2) in secondLevels[index1]"
                style="font-size:20px;"
                :key=index2>
                {{secondl}}
                <div style="height:10px;"></div>
                <div
                    v-for="(item,index3) of items"
                    :key=index3>
                    <div
                        style="
                            display:flex;
                            border-style:solid;
                            font-size:15px;
                            border-width:1px;
                            border-color:#797979;
                            height:auto;
                            line-height:30px;
                            text-align:left;
                            padding-left:10px;"
                        :style="{background:colors[0]}"
                        v-if="item.first_level === firstl && item.second_level === secondl">
                        [{{item.standard_name}}]：{{item.detial}}
                    </div>
                </div>
            </div>
        </div>
    </el-container>
    </div>
</el-container>
</template>

<script>
export default {
    name:"MergeStandard",
    data(){
        return{
            colors:["#D7D7D7","#FFFFFF"],
            names:[],
            mylist:[],
            items:[],
            firstLevels:[],
            secondLevels:[]
        }
    },
    mounted(){
        var templist = this.$route.params
        this.mylist = templist.mylist
        // 根据id列表获取标准内容
        this.getStandards()
    },
    methods:{
        getStandards(){
            const qs = require('qs');   //list序列化
            var that = this
            this.axios({
                method: 'post',
                data: this.mylist,
                paramsSerializer: function(params) {
                    return qs.stringify(params, { arrayFormat: 'repeat' })
                },
                url: 'http://localhost:8086/api/standard/MergePage'
            }).then(function (response) {
                if(response.data.code == 200){
                    alert("获取合并标准信息失败")
                }else{
                    that.items = response.data.items;
                    that.names = response.data.names;
                    for(var i = 0 ; i < that.items.length ; i ++){
                        var temp = that.items[i].first_level
                        if( that.firstLevels.indexOf(temp) == -1){
                            that.firstLevels.push(temp)
                        }
                    }

                    for(var i = 0 ; i < that.items.length ; i ++){
                        var tempFirst = that.items[i].first_level
                        var tempSecond = that.items[i].second_level
                        for(var j = 0 ; j < that.firstLevels.length ; j ++){
                            if(tempFirst == that.firstLevels[j]){
                                if(that.secondLevels.length < j+1){
                                    var templist = []
                                    that.secondLevels.push(templist)
                                }

                                if(that.secondLevels[j].indexOf(tempSecond) == -1){
                                    that.secondLevels[j].push(tempSecond)
                                }
                            }
                        }
                    }
                }
        })

        },
        downloadFile(){
            var filename =''
            filename += "合并文档"
            for(var i = 0 ; i < this.names.length ; i ++){
                filename += "《"
                filename += this.names[i]
                filename += "》"
            }
            this.$PDFSave(this.$refs.exportPdf, filename);

        },
        jumpToMainPage(){
            this.$router.push({name:'MainPage',params:{}});
        }
    }

}
</script>

<style>

</style>