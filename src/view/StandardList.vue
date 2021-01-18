<template>
<el-container style="width:1262px;"
    direction="vertical">
    <Header></Header>
    <el-container>
      <el-aside
        style="width:245px;">
        <el-menu
          :default-active="activeBusiness"
          class="el-menu-vertical-demo"
          @select="switchBusiness"
          style="width:244px;">
          <el-menu-item 
            style="
              width:244px;
              height:62px;
              font-size:30px;">
            <span slot="title">
              工程分类
            </span>
          </el-menu-item>
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
        <h1 
          style="
            height:50px;
            line-height:50px;
            margin:0 auto;
            text-align:left;">
          标准列表——{{activeBusiness}}
        </h1>
        <div style="background-color:red">
          搜索框
        </div>
        
        <el-table
          :data="tableData"
          stripe
          style="width: 100%;">
          <el-table-column
            align="center"
            prop="name"
            label="标准名称"
            width="250">
          </el-table-column>
          <el-table-column
            align="center"
            prop="className"
            label="标准级别"
            width="150">
          </el-table-column>
          <el-table-column
            align="center"
            prop="date"
            label="创建日期"
            width="150">
          </el-table-column>
          <el-table-column
            align="center"
            width="150"
            label="操作">
            <template slot-scope="scope">
              <div @click="pickUp(scope.$index)" v-show="tableData[scope.$index].chosen===false">
                选择为对比项
              </div>
              <div @click="putDown(scope.$index)" v-show="tableData[scope.$index].chosen===true">
                移除对比项
              </div>
            </template>
          </el-table-column>
        </el-table>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  name:"StandardList",
  data(){
    return{
      BusinessData:"",
      classList:["地方标准","行业标准","企业标准"],   //需要规定三个的顺序
      activeBusiness:"智慧工地建设和应用统一标准",
      standardList:"",
      tableData:[],
      
    }
  },
  mounted(){
    this.getBusinessData();
    let that = this
    this.axios({
        method: 'get',
        url: 'http://localhost:8080/static/mock/UnifyData.json'
        }).then(function (response) {
          that.standardList = response.data.standardList
            for(var i=0; i < that.standardList.length; i++){
              that.standardList[i].chosen = false;
              that.standardList[i].className = that.classList[that.standardList[i].class_id]
            }
            that.tableData = that.standardList
        })
  },
  methods:{
    getBusinessData(){
      let that = this
      this.axios({
          method: 'get',
          url: 'http://localhost:8080/static/mock/BusinessData.json'
          }).then(function (response) {
            that.BusinessData = response.data.BusinessData;
          })
    },
    switchBusiness(key, keyPath){
      this.activeBusiness=key

      //获取到所选择板块的工程类型，留出接口，方便后期对接后台查询
      var businessId=""
      for(var i=0; i<this.BusinessData.length; i++){
        if(this.BusinessData[i].name === key){
          businessId = this.BusinessData[i].id - 1
          console.log(businessId)
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
              that.standardList[i].chosen = false;
              that.standardList[i].className = that.classList[that.standardList[i].class_id]
            }
            that.tableData = that.standardList
          })
    },
    pickUp(index){
      this.tableData[index].chosen = true;
    },
    putDown(index){
      this.tableData[index].chosen = false;
    }
  }

}
</script>

<style scoped>
  .el-main {
    background-color:#FFFFFF;
    color: #333;
    text-align: center;
  }
</style>