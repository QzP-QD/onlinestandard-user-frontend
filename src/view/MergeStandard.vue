<template>
<el-container style="width:1262px;"
    direction="vertical">
    <Header></Header>
    <div 
        style="
            display:flex;
            width:1262px;">
        <h1>合并标准文档</h1>
        <el-button
            @click="downloadFile"
            style="float:right ">
            下载合并文档
        </el-button>
    </div>
    <el-container direction="vertical">
        <div
            v-for="(firstl, index1) in firstLevels"
            :key=index1>
            <h1>{{firstl}}</h1>
            <div 
                v-for="(secondl, index2) in secondLevels[index1]"
                :key=index2>
                {{secondl}}
                <div
                    v-for="(item,index3) of items"
                    :key=index3>
                    <div
                        style="
                            display:flex;
                            border-style:solid;
                            border-width:1px;
                            border-color:#797979;
                            height:auto;
                            line-height:30px;
                            text-align:left;
                            padding-left:10px;"
                        v-if="item.first_level === firstl && item.second_level === secondl">
                        {{item.detial}}
                    </div>
                </div>
            </div>
        </div>
    </el-container>
</el-container>
</template>

<script>
export default {
    name:"MergeStandard",
    data(){
        return{
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
            var that = this
            this.axios({
            method: 'get',
            url: 'http://localhost:8080/static/mock/mergestandard.json'
                }).then(function (response) {
                that.items = response.data.items;
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
            })

        }
    }

}
</script>

<style>

</style>