import Vue from 'vue'
import App from './App'
import Store from './store/index'
import fly from './fly'

Vue.prototype.$http = fly;

// 取值：let house =this.$store.state.playerId
// 赋值：this.$store.commit('increment', result)
Vue.prototype.producrionTip = false
App.mpType = 'app'
Vue.prototype.$store = Store
const app = new Vue(App)
app.$mount()



