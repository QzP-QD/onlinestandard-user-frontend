<template>
<el-container 
    direction="vertical">
    <Header></Header>
    <div 
      style="
        display:flex;
        line-height:40px;
        height:40px;">
      <h4 style="margin-top:0px;">主页</h4>
      <h4 style="margin-top:0px;">>></h4>
      <h4 style="margin-top:0px;">{{activeBusiness}}</h4>
      <h4 v-if="mode === 2" style="margin-top:0px;">>></h4>
      <h4 v-if="mode === 2" style="margin-top:0px;">{{standardName}}</h4>
    </div>
    <el-container>
    <div v-show="mode === 1">
        <List :activeBusiness="activeBusiness"
            @goforDetial="gotoDetial">
        </List>
    </div>

    <div v-show="mode === 2">
        <Detial></Detial>
    </div>    

  </el-container>
  <el-footer
    style="
      height:50px;
      line-height:50px;
      background-color:#B3C0D1;">
      @智慧标准集成应用 --- 北京邮电大学（BUPT） --- 高性能计算及组网实验室（HPCN）
  </el-footer>
</el-container>
</template>

<script>
export default {
  name:"StandardList",
  data(){
    return{
      mode:1, //1代表列表形式，2代表详情形式
      BusinessData:"",
      activeBusiness:"智慧工地建设和应用统一标准",  //默认选中的工程类型
      standardName:'',
      standardID:''
    }
  },
  mounted(){
    this.getBusinessData();
  },
  methods:{
    //获取左侧工程分类信息
    getBusinessData(){
      let that = this
      this.axios({
        method: 'get',
        url: 'http://localhost:8086/api/business/getBusiness'
        }).then(function (response) {
          if(response.data.code == 200){
            alert("获取行业类型列表失败")
          }else{
            that.BusinessData = response.data.BusinessData;
          }
        })
    },
    //左侧工程分类切换响应方法
    switchBusiness(key, keyPath){
      if(key != null){
        this.mode = 1
        this.activeBusiness = key
      }
    },
    gotoDetial(msg){
      this.mode = 2
      this.standardName = msg
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