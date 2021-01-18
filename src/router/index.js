//导入vue
import Vue from 'vue'
import VueRouter from 'vue-router'

import StandardList from "../view/StandardList"

//使用
Vue.use(VueRouter);
//导出
export default new VueRouter({
    routes:[
        {
            path:'/list',
            component: StandardList,
        },
    ]
})