import Vue from 'vue'
import Router from 'vue-router'
import App from './views/App'

Vue.use(Router)


export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
      {
        path: '/',
        component: App,
        children: [
            {name: 'home', path: '/', component: ()=>import('./views/App/Home')},
            {name: 'calendar', path: 'calendar', component: ()=>import('./views/App/Calendar')},
            {name: 'settings', path: 'settings', component: ()=>import('./views/App/Settings')},
            {name: 'updateUserDetails', path: 'update_user', component: ()=>import('./views/App/UpdateUserDetails')},
            {name: 'feedback', path: 'feedback', component: ()=>import('./views/App/Feedback')},
            {name: 'task', path: 'task', component: ()=>import('./views/App/Task')},
            {name: 'events', path: 'events', component: ()=>import('./views/App/Event'), props: true},
        ]
      },
    {
      path: '/login',
      name: 'login',
      component: _=> import('./views/Auth/Login')
    },
    {
      path: '/sign-up',
      name: 'signUp',
      component: _=> import('./views/Auth/SignUp')
    },
    {path: "/", redirect: '/tasks'}
  ]
})
