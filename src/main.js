// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from "vue-router"
import axios from 'axios'
import VueAxios from 'vue-axios'
//扫描路由配置
import router from "./router"
//导入elementUI
import ElementUI from "element-ui"
//导入element CSS
import 'element-ui/lib/theme-chalk/index.css'

import Header from "./components/Header"
import List from "./components/List"
import Detial from "./components/Detial"

//使用
Vue.use(VueRouter)
Vue.use(VueAxios, axios)
Vue.use(ElementUI)

Vue.config.productionTip = false

Vue.component("Header", Header)
Vue.component("List", List)
Vue.component("Detial", Detial)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render:h => h(App)
})
