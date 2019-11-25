//Import dependencies
import Vue from 'vue'
import App from './views'
import router from './router'
import store from './store'
import config from './config'

import vCalendar from 'v-calendar'
import 'v-calendar/src/styles/tailwind-lib.css'
import iView from 'iview'
import locale from 'iview/dist/locale/en-US'
import FirebasePlugin from './plugins/firebase.plugin'
import CapacitorPlugin from './plugins/capacitor.plugin'
import { defineCustomElements } from '@ionic/pwa-elements/loader';

import 'iview/dist/styles/iview.css'
import 'vue2-animate/dist/vue2-animate.min.css'



//App Plugins for vue
Vue.use( vCalendar)
Vue.use(CapacitorPlugin)
Vue.use(FirebasePlugin, config.firebaseConfig)
Vue.use(iView, {
  size: 'large',
  locale
})

Vue.config.productionTip = false

Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

//Init Vue
new Vue({
  router,
  store,
  render: h => h(App),
  mounted(){
    defineCustomElements(window)
  },
}).$mount('#app')
