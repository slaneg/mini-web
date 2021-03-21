import Vue from 'vue'
import Index from './index'
import WxValidate from'../../tools/WxValidate.js'
Vue.prototype.WxValidate = WxValidate
const index = new Vue(Index)
index.$mount()
