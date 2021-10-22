import Vue from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import axios from 'axios'
import Paginate from 'vuejs-paginate'

axios.defaults.baseURL = process.env.VUE_APP_API_URL

Vue.config.productionTip = false
Vue.component('paginate', Paginate)

new Vue({
  render: h => h(App),
}).$mount('#app')
