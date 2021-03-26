<template>
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
            <el-table-column
              align="center"
              width="150"
              label="操作">
              <template slot-scope="scope">
                <el-button 
                  type="text"
                  style="color:#169BD5"
                  @click="pickUp(scope.$index)" 
                  v-show="tableData[scope.$index+(currentPage-1)*pageSize].chosen === false">
                    选择为对比项
                </el-button>
                <el-button
                  type="text" 
                  @click="putDown(scope.$index,true)" 
                  style="color:#D57816"
                  v-show="tableData[scope.$index+(currentPage-1)*pageSize].chosen === true">
                    移除对比项
                </el-button>
              </template>
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
        <div 
          style="background-color:red;
            height:20px;">
          <el-table
            :data="standardPrepared"
            style="width: 100%;">
            <el-table-column
              align="center"
              prop="name"
              label="已选中"
              width="225">
            </el-table-column>
            <el-table-column
              width="25">
              <template slot-scope="scope">
                <i class="el-icon-delete"
                  @click="putDown(scope.$index,false)"></i>
              </template>
            </el-table-column>
          </el-table>
          <el-button 
            @click="mergeStandard"
            v-if="standardPrepared.length > 1">
              生成合并文档
          </el-button>
        </div>
      </div>
    </el-main>
</template>

<script>
//引入bus作为数据传输总线
import bus from "./eventbus";

export default {
    name:"List",
    data(){
        return{
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
            standardPrepared:[],
        }
    },
    props:[
        'activeBusiness'
    ],
    mounted(){
        this.currentPage=1
        this.standardPrepared = []
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
                for(var i=0; i < that.standardList.length; i++){
                    that.standardList[i].chosen = false
                }
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

        bus.$on("deleteID",function(id){
            for(var i=0; i < that.standardPrepared.length; i++){
                if(that.standardPrepared[i].id === id){
                    that.standardPrepared.splice(i,1)
                    break
                }
            }
            for(var i=0; i < that.standardList.length; i++){
                if(that.standardList[i].id === id){
                    that.standardList[i].chosen = false
                    break
                }
            }
            that.tableData = that.standardList
        })

        bus.$on("addID",function(id){
            for(var item of that.standardList){
                if(item.id === id){
                    item.chosen = true
                    that.standardPrepared.push(item)
                    break
                }
            }
            that.tableData = that.standardList
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
                this.standardPrepared = []

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
                        for(var i=0; i < that.standardList.length; i++){
                            that.standardList[i].chosen = false
                        }
                        that.tableData = that.standardList
                      }
                    })
            }
        },
        //选中标准作为对比
        pickUp(index){
            var realIndex = index + (this.currentPage-1)*this.pageSize
            this.tableData[realIndex].chosen = true
            this.$set(this.tableData, realIndex, this.tableData[realIndex])

            this.standardPrepared.push(this.tableData[realIndex])

            this.uptodate()
        },
        //取消选中，loc标识调用来源
        putDown(index, loc){
            if(loc){
                var realIndex = index + (this.currentPage-1)*this.pageSize
                this.tableData[realIndex].chosen = false
                this.$set(this.tableData, realIndex, this.tableData[realIndex])
        
                var target = this.tableData[realIndex].id
                for(var i=0; i < this.standardPrepared.length; i++){
                    if(this.standardPrepared[i].id === target){
                        this.standardPrepared.splice(i,1)
                        break
                    }
                }
                this.uptodate()
            }else{
                var target = this.standardPrepared[index].id
                for(var i=0; i < this.standardList.length; i++){
                    if(this.standardList[i].id === target){
                        this.standardList[i].chosen = false
                        break
                    }
                }
                this.standardPrepared.splice(index,1)
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
            this.uptodate()
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
            this.uptodate()
            this.selectedClass = ''
            this.selectedProv = ''
            this.selecetdCity = ''
            this.currentPage = 1
            this.tableData = this.standardList
        },
        //保持standardList和tabledata中的数据一致
        uptodate(){
            for(var item1 of this.tableData){
                for(var item2 of this.standardList){
                if(item1.id === item2.id)
                    item2.chosen = item1.chosen
                }
            }
        },
        //查看标准详情响应
        forDetail(row){
            this.uptodate()

            this.$emit('goforDetial', row.name)
            this.selectedClass = ''
            this.selectedProv = ''
            this.selecetdCity = ''
            this.currentPage = 1
            this.tableData = this.standardList

            var temp = {}
            temp.standardPrepared = this.standardPrepared
            temp.id = row.id
            temp.chosen = row.chosen
            temp.activeBusiness = this.activeBusiness
            bus.$emit("sendID",temp)
        },
        mergeStandard(){
            var idlist = []
            for(var item of this.standardPrepared){
                idlist.push(item.id)
            }
            this.$router.push({name:'MergePage',params:{mylist:idlist}});
        }
    }
}
</script>

<style>

</style>