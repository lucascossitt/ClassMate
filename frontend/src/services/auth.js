import api from './api'

class AuthService {
    _setUserData(userData) {
        localStorage.setItem('user', JSON.stringify(userData))
    }

    _clearUserData() {
        localStorage.removeItem('user')
    }

    async login(email, senha) {
        try {
            const response = await api.post('/auth/login', {email, senha})
            if (response.data.token) {
                this._setUserData(response.data)
            }
            return response.data
        } catch (error) {
            console.error("Login error:", error)
            throw error
        }
    }

    async register(nome, email, senha) {
        try {
            const response = await api.post('/auth/register', {nome, email, senha})
            if (response.data.token) {
                this._setUserData(response.data)
            }
            return response.data
        } catch (error) {
            console.error("Registration error:", error)
            throw error
        }
    }

    logout() {
        this._clearUserData()
    }

    async updatePassword(senhaAtual, novaSenha, confirmarSenha) {
        try {
            const response = await api.post('/auth/update-password', {
                senhaAtual,
                novaSenha,
                confirmarSenha
            })
            return response.data
        } catch (error) {
            console.error("Update password error:", error)
            throw error
        }
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'))
    }
}

export default new AuthService()