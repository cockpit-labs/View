import Vue from 'vue'
import VueRouter from 'vue-router'
import TemplateMain from '../views/TemplateMain'
import Home from '../views/Home.vue'
import PageNotFound from '../views/PageNotFound.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: TemplateMain,
    children: [{
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: 'answers',
      name: 'answers',
      component: () => import(/* webpackChunkName: "answers" */ '../views/Answers.vue')
    },
    {
      path: 'dashboard',
      name: 'dashboard',
      component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue')
    },
    {
      path: 'gallery',
      name: 'gallery',
      component: () => import(/* webpackChunkName: "gallery" */ '../views/Gallery.vue')
    },
    {
      path: 'tasks',
      name: 'tasks',
      component: () => import(/* webpackChunkName: "tasks" */ '../views/Tasks.vue')
    }]
  },
  {
    path: '/folders/:folderId/:questionnaireNumber',
    name: 'questionnaire',
    props: true,
    component: () => import(/* webpackChunkName: "questionnaire" */ '../views/QuestionnairePage.vue')
  },
  {
    path: '*',
    component: PageNotFound
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/logout') {
    router.app.$keycloak.logout()
  } else {
    if (router.app.$keycloak.authenticated) {
      next()
    } else {
      router.app.$keycloak.login()
    }
  }
})

export default router
