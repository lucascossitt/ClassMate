import {createRouter, createWebHistory} from 'vue-router'
import store from '../store'


import HomeView from '../views/Home.vue'
import TurmaListView from '../views/TurmaList.vue'
import TurmaFormView from '../views/TurmaForm.vue'
import EditTurma from '../views/EditTurmaForm.vue'
import WikiListView from '../views/WikiList.vue'
import WikiFormView from '../views/WikiForm.vue'
import EditWiki from '../views/EditWikiForm.vue'
import LembreteListView from '../views/LembreteList.vue'
import LembreteFormView from '../views/LembreteForm.vue'
import EditLembrete from '../views/EditLembreteForm.vue'
import GrupoList from '../views/GrupoList.vue'
import EditGrupoForm from '../views/EditGrupoForm.vue'
import Login from '../views/Login.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: Login,
            meta: {requiresGuest: true},
        },
        {
            path: '/',
            name: 'Home',
            component: HomeView,
            meta: {requiresAuth: true}
        },
        {
            path: '/turmas',
            name: 'TurmaList',
            component: TurmaListView,
            meta: {requiresAuth: true}
        },
        {
            path: '/turmas/cadastrar',
            name: 'TurmaForm',
            component: TurmaFormView,
            meta: {requiresAuth: true}
        },
        {
            path: '/turmas/editar/:id',
            name: 'EditTurma',
            component: EditTurma,
            props: true,
            meta: {requiresAuth: true}
        },
        {
            path: '/wikis',
            name: 'WikiList',
            component: WikiListView,
            meta: {requiresAuth: true}
        },
        {
            path: '/wikis/cadastrar',
            name: 'WikiForm',
            component: WikiFormView,
            meta: {requiresAuth: true}
        },
        {
            path: '/wikis/editar/:id',
            name: 'EditWiki',
            component: EditWiki,
            props: true,
            meta: {requiresAuth: true}
        },
        {
            path: '/lembretes',
            name: 'LembreteList',
            component: LembreteListView,
            meta: {requiresAuth: true}
        },
        {
            path: '/lembretes/cadastrar',
            name: 'LembreteForm',
            component: LembreteFormView,
            meta: {requiresAuth: true}
        },
        {
            path: '/lembretes/editar/:id',
            name: 'EditLembrete',
            component: EditLembrete,
            props: true,
            meta: {requiresAuth: true}
        },
        {
            path: '/grupos',
            name: 'GrupoList',
            component: GrupoList,
            meta: {requiresAuth: true}
        },
        {
            path: '/grupos/editar/:id',
            name: 'EditGrupo',
            component: EditGrupoForm,
            props: true,
            meta: {requiresAuth: true}
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: '/'
        }
    ]
})

router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
    const isLoggedIn = store.getters.isLoggedIn

    if (requiresAuth && !isLoggedIn) {
        next('/login')
    } else if (requiresGuest && isLoggedIn) {
        next('/')
    } else {
        next()
    }
})

export default router