<template>
 <el-main>
    <el-header style="height:40px;
                display:flex;
                margin-bottom:10px;">
        <div
            style="
                height:40px;
                font-size:40px;
                line-height:40px;
                margin-right:10px;
                font-size:20px;">
            {{standardDetial.name}}
        </div>
    </el-header>
    <!-- 分割线 -->
    <div style="border-bottom-style:solid;
            border-color:#D7D7D7"/>
    <el-contaner>
        <el-aside>
            <el-tree :data="standardDetial" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </el-aside>
        <el-main v-show="nodeOnShow.content != undefined" >
            {{nodeOnShow.content}}
            <h4
          v-if="nodeOnShow.equip !== undefined && nodeOnShow.equip.length == 0"
          >无关联设备</h4>
        <div>
          <h4
            style="line"
            v-if="nodeOnShow.equip !== undefined && nodeOnShow.equip.length > 0">已关联设备</h4>
          <div
            style="padding:10px;"
            v-for="(item,index) in nodeOnShow.equip"
            :key="index">
            <div
              v-if="item.type == 0">
            {{item.equip_name}}-{{item.property_name}}：{{item.data1}}
            </div>
            <div
              v-if="item.type == 1">
              {{item.equip_name}}-{{item.property_name}}：{{item.data1}} 至 {{item.data2}}
            </div>
          </div>
        </div>
        </el-main>
    </el-contaner>
</el-main>
</template>

<script>
import bus from "./eventbus";

export default {
    name:"Detial",
    data(){
        return{
            colors:["#D7D7D7","#FFFFFF"],
            standardDetial:{},
            standardInfo:"",
            nodeOnShow:{},
            defaultProps:""
        }
    },
    mounted(){
        var that = this
        bus.$on("sendID",function(mydata){
            that.getStandard(mydata)
        })
    },
    methods:{
        getStandard(mydata){
            var that = this
            this.axios({
                method: 'get',
                url: "http://localhost:8086/grade/" + mydata.id
                }).then(function (response) {
                    if(response.data.code == 500){
                        alert("获取场景标准信息失败")
                    }else{
                        that.standardDetial = response.data.result.catalog
                        that.standardInfo = response.data.standardInfo
                    }
                })
        },
        itemsInClass(itemclass){
            var temp = []
            for(var item of this.standardDetial.items){
                if(item.first_level === itemclass)
                    temp.push(item)
            }
            return temp
        },
        handleNodeClick(data){
            this.nodeOnShow = data;
        }
    }
}
</script>

<style>
    .el-main {
        background-color:#FFFFFF;
        color: #333;
        text-align: center;
        line-height:20px;
    }

</style>