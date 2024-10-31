import {createStore} from 'vuex'
import AuthService from '../services/auth'

const user = JSON.parse(localStorage.getItem('user'))
const initialState = user
    ? {status: {loggedIn: true}, user}
    : {status: {loggedIn: false}, user: null}

export default createStore({
    state: initialState,
    mutations: {
        loginSuccess(state, user) {
            state.status.loggedIn = true
            state.user = user
        },
        loginFailure(state) {
            state.status.loggedIn = false
            state.user = null
        },
        logout(state) {
            state.status.loggedIn = false
            state.user = null
        },
        registerSuccess(state) {
            state.status.loggedIn = false
        },
        registerFailure(state) {
            state.status.loggedIn = false
        }
    },
    actions: {
        async login({commit}, {email, senha}) {
            try {
                const user = await AuthService.login(email, senha)
                commit('loginSuccess', user)
                return user
            } catch (error) {
                commit('loginFailure')
                throw error
            }
        },
        async register({commit}, {nome, email, senha}) {
            try {
                const user = await AuthService.register(nome, email, senha)
                commit('registerSuccess')
                return user
            } catch (error) {
                commit('registerFailure')
                throw error
            }
        },
        logout({commit}) {
            AuthService.logout()
            commit('logout')
        }
    },
    getters: {
        isLoggedIn: state => state.status.loggedIn,
        currentUser: state => state.user,
        userRole: state => state.user?.data?.user?.role || null
    }
})