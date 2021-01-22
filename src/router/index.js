//导入vue
import Vue from 'vue'
import VueRouter from 'vue-router'

import StandardList from "../view/StandardList"
import StandardDetail from "../view/StandardDetail"
import Standard from "../view/Standard"

//使用
Vue.use(VueRouter);
//导出
export default new VueRouter({
    mode: 'history',
    routes:[
        {
            path:'/',
            component: Standard,
        },
        {
            path:'/list',
            component: StandardList,
        },
        {
            path:'/detail',
            component: StandardDetail,
        }
    ]
})