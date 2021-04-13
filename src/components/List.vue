<template>
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
    <h1 
      style="
        height:40px;
        line-height:40px;
        margin:0 auto;
        text-align:left;">
      标准列表——{{activeBusiness}}
    </h1>
    <div>
      标准检索：
      <el-select
        placeholder="请选择标准等级"
        v-model="selectedClass">
        <el-option
          label="（空）"
          value="nocondition">
        </el-option>
        <el-option
          v-for="(item, index) in classes"
          :key=index
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select
        placeholder="请选择省份"
        v-model="selectedProv"
        v-on:change="getProv($event)">
        <el-option
          label="（空）"
          value="nocondition">
        </el-option>
        <el-option
          v-for="(prov, index) in provs"
          :key=index
          :label="prov.label"
          :value="prov.value">
        </el-option>
      </el-select>
      <el-select
        placeholder="请选择城市"
        v-model="selecetdCity">
        <el-option
          label="（空）"
          value="nocondition">
        </el-option>
        <el-option
          v-for="(city, index) in cities"
          :key=index
          :label="city.label"
          :value="city.value">
        </el-option>
      </el-select>
      <i class="el-icon-search"
        @click="filtStandards"
        style="color:#169BD5;
          height:40px;
          width:40px;">
      </i>
      <i class="el-icon-refresh"
        @click="refresHandler"
        style="color:#169BD5;
          height:40px;
          width:40px;">
      </i>
    </div>
    <div style="display: flex;">
      <div>
        <el-table
          :data="tableData.slice((currentPage-1)*pageSize, currentPage*pageSize)"
          stripe
          style="width: 100%;">
          <el-table-column
            align="center"
            prop="name"
            label="标准名称"
            width="250">
            <template slot-scope="scope">
                <el-button type="text" 
                  style="color:#000000"
                  @click="forDetail(scope.row)">
                  {{scope.row.name}}
                </el-button>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="class_name"
            label="标准级别"
            width="150">
          </el-table-column>
          <el-table-column
            align="center"
            prop="date"
            label="创建日期"
            width="150">
          </el-table-column>
        </el-table>
        <el-pagination
          background
          @current-change="nextPage"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total,prev, pager, next"
          :total="tableData.length"
          style="text-align:center">
        </el-pagination>
      </div>
    </div>
  </el-main>
</el-container>
</template>

<script>
//引入bus作为数据传输总线
import bus from "./eventbus";

export default {
    name:"List",
    data(){
        return{
            activeBusiness:"智慧工地建设和应用统一标准",  //默认选中的工程类型
            BusinessData:"",
            standardList:"",
            tableData:[],
            currentPage:0,
            pageSize:6,
            classes:[],
            provs:[] ,
            allCities:[],
            cities:[],
            selectedClass:'',
            selectedProv:'',
            selecetdCity:'',
        }
    },
    props:[
        'activeBusiness'
    ],
    mounted(){
        this.currentPage=1
        this.getBusinessData();
        var that = this
        this.axios({
            method:'get',
            url:'http://localhost:8086/api/class/getClass',
            params:{
                id:0,
                name:""
            }
        }).then(function(response){
          if(response.data.code == 200){
            alert("获取场景标准等级失败")
          }else{
            that.classes = response.data
          }
        })

        this.axios({
            method: 'get',
            url: 'http://localhost:8086/api/standard/getBybusiness',
            params:{
                activeBusiness: this.activeBusiness
            }
            }).then(function (response) {
              if(response.data.code == 200){
                alert("获取场景标准列表失败")
              }else{
                that.standardList = response.data.standardList
                that.tableData = that.standardList
              }
            })
        
        this.axios({
            method:"get",
            url:"http://localhost:8086/api/location/getLoc"
        }).then(function(response){
          if(response.data.code == 200){
            alert("获取地理信息失败")
          }else{
            that.provs = response.data.provs
            that.allCities = response.data.allCities
          }
        })
    },
    watch:{
        activeBusiness:"switch"
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
        switch(curval, oldval){
            if(curval !== oldval){
                this.selectedClass = ''
                this.selectedProv = ''
                this.selecetdCity = ''
                this.currentPage = 1
                this.cities = []

                //获取到所选择板块的工程类型id，留出接口，方便后期对接后台查询
                var businessId=""
                for(var i=0; i<this.BusinessData.length; i++){
                    if(this.BusinessData[i].name === curval){
                        businessId = this.BusinessData[i].id - 1
                        break
                    }
                }

                var that = this
                this.axios({
                    method: 'get',
                    url: 'http://localhost:8086/api/standard/getBybusiness',
                    params:{
                        activeBusiness: that.activeBusiness
                    }
                    }).then(function (response) {
                      if(response.data.code == 200){
                        alert("获取行业类型列表失败")
                      }else{
                        that.standardList = response.data.standardList
                        that.tableData = that.standardList
                      }
                    })
            }
        },
        //下一页
        nextPage(val){
            this.currentPage=val
        },
        //级联选择框选择省份
        getProv(prov){
            var tempcities = []
            this.cities = []
            this.selecetdCity = ''
            for(var temp of this.allCities){
                if(prov === temp.prov){
                  tempcities.push({label:temp.label, value:temp.label})
                }
            }
            this.cities = tempcities
        },
        //查询按钮响应方法
        filtStandards(){
            var temptable = []
            for(var item of this.standardList){
                if((this.selectedClass === "nocondition" || this.selectedClass === "" || item.class_name === this.selectedClass)
                && (this.selectedProv === "nocondition" || this.selectedProv === "" ||item.province_name === this.selectedProv)
                && (this.selecetdCity === "nocondition" || this.selecetdCity === "" ||item.city_name === this.selecetdCity)){
                    temptable.push(item)
                }
            }
            this.tableData = temptable
        },
        //重置按钮
        refresHandler(){
            this.selectedClass = ''
            this.selectedProv = ''
            this.selecetdCity = ''
            this.currentPage = 1
            this.tableData = this.standardList
        },
        //查看标准详情响应
        forDetail(row){
            this.$emit('goforDetial', row.name)
            this.selectedClass = ''
            this.selectedProv = ''
            this.selecetdCity = ''
            this.currentPage = 1
            this.tableData = this.standardList

            var temp = {}
            temp.id = row.id
            temp.activeBusiness = this.activeBusiness
            bus.$emit("sendID",temp)
        },
    }
}
</script>

<style>

</style>