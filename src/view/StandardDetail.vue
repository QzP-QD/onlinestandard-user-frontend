<template>
<el-container style="width:1262px;"
    direction="vertical">
    <Header></Header>
    <div 
      style="display:flex;">
      <h4 style="margin:7px;">
         主页
      </h4>
      <h4 style="margin:7px;">
        >>
      </h4>
      <h4 style="margin:7px;">
        {{activeBusiness}}
      </h4>
    </div>
    <el-container>
      <el-aside
        style="width:245px;">
        <div
          style="
            width:244px;
            height:60px;
            line-height:60px;
            background-color:#027DB4;
            color:#FFFFFF;
            text-align:center;
            font-size:30px;">
              工程分类
        </div>
        <el-menu
          :default-active="activeBusiness"
          class="el-menu-vertical-demo"
          @select="switchBusiness"
          style="width:244px;
            text-align: center;">
          <el-menu-item 
            v-for="(business, i) of BusinessData"
            :key=i
            :index="business.name"
            style="height:48px;">
            <span slot="title">
              {{business.name}}
            </span>
          </el-menu-item>
        </el-menu>
      </el-aside>
    <el-main>
      {{standardData}}
    </el-main>
  </el-container>
</el-container>
</template>

<script>
//引入bus作为数据传输总线
import bus from "./eventbus";

export default {
  name:"StandardDetail",
  data(){
    return{
      BusinessData:"",
      activeBusiness:"",  //mounted时从list页面传过来
      standardList:"",      //mounted时从list页面传过来
      standardPrepared:[],   //mounted时从list页面传过来
      standardData:''
    }
  },
  mounted(){
    this.getBusinessData();
    var that = this
    bus.$on("gotoDetail",function(mydata){
        console.log(mydata)
        that.activeBusiness = mydata.activeBusiness
        that.standardPrepared = mydata.standardPrepared
        that.standardList = mydata.standardList
        var standardId = mydata.standard.id
        that.getStandardData(standardId)
    })
  },
  methods:{
    //获取左侧工程分类信息
    getBusinessData(){
      let that = this
      this.axios({
          method: 'get',
          url: 'http://localhost:8080/static/mock/BusinessData.json'
          }).then(function (response) {
            that.BusinessData = response.data.BusinessData;
          })
    },
    //左侧工程分类切换响应方法
    switchBusiness(key, keyPath){
      if(key != null){
        this.activeBusiness=key
        this.selectedClass = ''
        this.selectedProv = ''
        this.selecetdCity = ''
        this.cities = []
        this.standardPrepared = []

        //获取到所选择板块的工程类型，留出接口，方便后期对接后台查询
        var businessId=""
        for(var i=0; i<this.BusinessData.length; i++){
          if(this.BusinessData[i].name === key){
            businessId = this.BusinessData[i].id - 1
            break
          }
        }
        
        //模拟获取对应工程类型的数据
        let that = this
        var nameList=["UnifyData","RailwayData","HighwayData","HousebuildingData","UrbanRailData","MunicipalData","WatherData"]
        this.axios({
            method: 'get',
            url: 'http://localhost:8080/static/mock/'+nameList[businessId]+'.json'
            }).then(function (response) {
              that.standardList = response.data.standardList
              for(var i=0; i < that.standardList.length; i++){
                that.standardList[i].chosen = false
              }
              that.tableData = that.standardList
            })
        this.currentPage=1
      }
    },
    getStandardData(standardId){
        let that = this
        this.axios({
            method: 'get',
            url: 'http://localhost:8080/static/mock/standardDetial.json'
            }).then(function (response) {
                that.standardData = response.data.standardData;
            })
    }
  }

}
</script>

<style scoped>
  .el-main {
    background-color:#FFFFFF;
    color: #333;
    text-align: center;
    line-height:20px;
  }
  .el-table__header tr,
  .el-table__header th {
    padding: 0;
    height: 20px;
    line-height: 20px;
}
.el-table__body tr,
.el-table__body td {
    padding: 0;
    height: 20px;
    line-height: 20px;
}

.el-menu-item.is-active {
      background-color: #1048A0;
      color: #fff;
  }
</style>