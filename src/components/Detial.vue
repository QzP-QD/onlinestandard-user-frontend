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
        <el-button 
            v-show="chosen === false" 
            @click="pickup">
                选中当前文档
        </el-button>
        <el-button
            type="danger" 
            v-show="chosen === true" 
            @click="putdown">
                移除文档
        </el-button>
    </el-header>
    <!-- 分割线 -->
    <div style="border-bottom-style:solid;
            border-color:#D7D7D7"/>
    <div style="display:flex;
            margin-top:10px;">
        <el-main>
            <div
                v-for="(itemclass, index) in classes"
                :key="index"
                style="margin-bottom:15px;">
                <div 
                    style="
                        line-height:40px;
                        height:40px;
                        font-size:20px;
                        text-align:left;">
                    {{itemclass}}:
                </div>
                <div 
                    v-for="(item, index1) in itemsInClass(itemclass)"
                    style="
                        display:flex;
                        border-style:solid;
                        border-width:1px;
                        border-color:#797979;
                        height:auto;
                        line-height:30px;
                        text-align:left;
                        padding-left:10px;"
                    :style="{background:colors[index1 % 2]}"
                    :key="index1">
                    <div>
                        {{index1 + 1}}、{{item.detial}}
                    </div>
                    <div 
                        style="
                            border-radius:50px;
                            height:20px;
                            line-height:20px;
                            width:40px;
                            text-align:center;
                            border-style:solid;
                            border-width:1px;
                            border-color:#000000;
                            background-color:#FFFFFF;
                            font-size:10px;
                            margin-left:50px;"
                        v-if="item.requested === false">
                        可  选
                    </div>
                    <el-popover
                        placement="right"
                        title="设备详情"
                        v-if="item.property_related === true"
                        trigger="click"
                        style="
                                height:30px;
                                line-height:30px;
                                width:70px;
                                text-align:center;
                                border-radius:5px;
                                border-style:solid;
                                border-width:1px;
                                border-color:#FFFFFF;
                                background-color:#1048A0;
                                color:#FFFFFF;
                                font-size:10px;
                                margin-left:50px;">
                            <h3>设备名称：</h3>
                                {{item.equip_name}}
                            <h3>属性名称：</h3>
                                {{item.property_name}}
                            <h3>设备属性要求：</h3>
                            <div v-if="item.property_type === 2">
                                {{item.value_1}}
                            </div> 
                            <div v-if="item.property_type === 1">
                                {{item.value_1}} ~ {{item.value_2}}
                            </div>
                            <div slot="reference">设备关联</div>                    
                    </el-popover>
                </div>
            </div>
        </el-main>
        <div style="
                width:290px;
                margin-top:60px;
                margin-left:20px;">
            <div style="
                background-color:#1048A0;
                    color:#FFFFFF;
                    font-size:20px;
                    height:30px;
                    line-height:30px;">
                已选文档
            </div>
            <div v-for="(item,index) in Prepared"
                :key="index"
                style="
                    font-size:15px;
                    height:30px;
                    line-height:30px;"
                :style="{background:colors[index % 2]}">
                {{item.name}}
            </div>
            <div
                v-if="Prepared.length > 1" 
                @click="mergeStandard"
                style="
                    background-color:#FFFFFF;
                    border-style:solid;
                    border-width:1px;
                    border-color:#000000;
                    color:#000000;
                    font-size:15px;
                    height:20px;
                    line-height:20px;">
                导出合并文档
            </div>
        </div>
    </div>
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
            Prepared:[],
            activeBusiness:'',
            chosen:'',
            classes:[]
        }
    },
    mounted(){
        var that = this
        bus.$on("sendID",function(mydata){
            that.getStandard(mydata)
            that.activeBusiness = mydata.activeBusiness
        })
    },
    methods:{
        getStandard(mydata){
            var that = this
            this.axios({
                method: 'get',
                // params:{
                //     mydata.id // 传到后台待查询数据
                // },
                url: 'http://localhost:8080/static/mock/standardDetial.json'
                }).then(function (response) {
                    that.standardDetial = response.data.standardDetial
                    that.standardDetial.chosen = mydata.chosen
                    that.chosen =  that.standardDetial.chosen
                    that.Prepared = mydata.standardPrepared

                    for(var item of that.standardDetial.items){
                        if(that.classes.indexOf(item.first_level) === -1){
                            that.classes.push(item.first_level)
                        }
                    }
                    that.classes = that.classes.sort()
                })
        },
        pickup(){
            this.standardDetial.chosen = true
            this.chosen = true

            //不用push到prepared ？？？
            bus.$emit("addID",this.standardDetial.id)
        },
        putdown(){
            this.standardDetial.chosen = false
            this.chosen = false
            var targetid = this.standardDetial.id
            for(var i=0; i < this.Prepared.length; i++){
                if(this.Prepared[i].id === targetid){
                    this.Prepared.splice(i,1)
                    break
                }
            }

            bus.$emit("deleteID",this.standardDetial.id)
        },
        itemsInClass(itemclass){
            var temp = []
            for(var item of this.standardDetial.items){
                if(item.first_level === itemclass)
                    temp.push(item)
            }
            return temp
        },
        mergeStandard(){
            var idlist = []
            for(var item of this.Prepared){
                idlist.push(item.id)
            }
            this.$router.push({name:'MergePage',params:{mylist:idlist}});
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