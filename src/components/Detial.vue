<template>
 <el-main>
    <el-header style="display:flex;">
        <h1>
            {{standardDetial.name}}
        </h1>
        <el-button 
            style="height:40px"
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
    
</el-main>
</template>

<script>
import bus from "./eventbus";

export default {
    name:"Detial",
    data(){
        return{
            standardDetial:{},
            Prepared:[],
            activeBusiness:'',
            chosen:''
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
                })
        },
        pickup(){
            this.standardDetial.chosen = true
            this.chosen = true

            var tempitem = {}
            console.log(this.standardDetial.id, this.standardDetial.name)
            tempitem.id = this.standardDetial.id
            tempitem.name = this.standardDetial.name
            tempitem.province_id = this.standardDetial.province_id
            tempitem.city_id = this.standardDetial.city_id
            tempitem.class_id = this.standardDetial.class_id
            tempitem.date = this.standardDetial.date
            tempitem.chosen = this.standardDetial.chosen

            // this.Prepared.push(tempitem)

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
        }
    }
}
</script>

<style>

</style>