<template>
    <div id="app">
        <nav v-if="isLoggedIn" class="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow-sm">
            <div class="container-fluid">
                <router-link class="navbar-brand ms-2" to="/">ClassMate</router-link>
                <button
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                    class="navbar-toggler"
                    data-bs-target="#navbarNav"
                    data-bs-toggle="collapse"
                    type="button"
                >
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div id="navbarNav" class="collapse navbar-collapse">
                    <ul class="navbar-nav me-auto">
                        <li class="nav-item">
                            <router-link class="nav-link" to="/grupos">Grupos</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/turmas">Turmas</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/lembretes">Lembretes</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/wikis">Wikis</router-link>
                        </li>
                    </ul>

                    <ul class="navbar-nav ms-auto align-items-center">
                        <li v-if="isAdmin" class="nav-item text-light me-3">
                            Status: <strong>{{ botInfo.state }}</strong>
                        </li>
                        <li v-if="isAdmin" class="nav-item">
                            <span class="badge bg-primary me-2">Grupos: {{ botInfo.groupCount }}</span>
                        </li>
                        <li v-if="isAdmin" class="nav-item">
                            <span class="badge bg-secondary me-2">Mensagens: {{ botInfo.messageCount }}</span>
                        </li>
                        <li v-if="isAdmin" class="nav-item">
                            <span class="badge bg-success">Uptime: {{ formatUptime(botInfo.uptime) }}</span>
                        </li>

                        <li class="nav-item dropdown ms-4">
                            <a
                                id="userDropdown"
                                aria-expanded="false"
                                class="nav-link dropdown-toggle btn btn-link"
                                data-bs-toggle="dropdown"
                                href="#"
                                role="button"
                            >
                                {{ currentUser.data.user.nome }}
                            </a>
                            <ul aria-labelledby="userDropdown" class="dropdown-menu dropdown-menu-end bg-dark">
                                <li>
                                    <a class="dropdown-item text-light" href="#" @click.prevent="openChangePassword">
                                        <i class="bi bi-key me-2"></i>Alterar Senha
                                    </a>
                                </li>
                                <li>
                                    <hr class="dropdown-divider">
                                </li>
                                <li>
                                    <a class="dropdown-item text-light" href="#" @click.prevent="handleLogout">
                                        <i class="bi bi-box-arrow-right me-2"></i>Logout
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

        <router-view/>

        <div id="changePasswordModal" aria-hidden="true" aria-labelledby="changePasswordModalLabel" class="modal fade"
             tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 id="changePasswordModalLabel" class="modal-title">Alterar Senha</h5>
                        <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" type="button"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="handleChangePassword">
                            <div class="mb-3">
                                <label class="form-label">Senha Atual</label>
                                <input
                                    v-model="passwordForm.senhaAtual"
                                    class="form-control"
                                    required
                                    type="password"
                                />
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Nova Senha</label>
                                <input
                                    v-model="passwordForm.novaSenha"
                                    class="form-control"
                                    minlength="8"
                                    required
                                    type="password"
                                />
                                <div class="form-text">A senha deve ter no mínimo 8 caracteres</div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Confirmar Nova Senha</label>
                                <input
                                    v-model="passwordForm.confirmarSenha"
                                    class="form-control"
                                    required
                                    type="password"
                                />
                            </div>
                            <div class="text-end">
                                <button class="btn btn-secondary me-2" data-bs-dismiss="modal" type="button">
                                    Cancelar
                                </button>
                                <button class="btn btn-primary" type="submit">
                                    Alterar Senha
                                </button>
                            </div>
                        </form>
                        <div v-if="passwordMessage" :class="['alert', passwordMessageClass, 'mt-3']">
                            {{ passwordMessage }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as bootstrap from 'bootstrap'
import api from './services/api'
import AuthService from './services/auth'

export default {
    name: 'App',
    data() {
        return {
            botInfo: {
                groupCount: 0,
                messageCount: 0,
                state: '',
                uptime: 0
            },
            passwordModal: null,
            fetchInterval: null,
            passwordForm: {
                senhaAtual: '',
                novaSenha: '',
                confirmarSenha: ''
            },
            passwordMessage: '',
            passwordMessageType: 'info'
        }
    },
    computed: {
        isLoggedIn() {
            return this.$store.getters.isLoggedIn
        },
        currentUser() {
            return this.$store.getters.currentUser
        },
        isAdmin() {
            return this.currentUser?.data?.user?.role === 'admin'
        },
        passwordMessageClass() {
            return `alert-${this.passwordMessageType}`
        }
    },
    mounted() {
        this.passwordModal = new bootstrap.Modal(document.getElementById('changePasswordModal'))
        const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'))
        dropdownElementList.map(function (dropdownToggleEl) {
            new bootstrap.Dropdown(dropdownToggleEl)
        })

        if (this.isLoggedIn && this.isAdmin) {
            this.fetchBotInfo()
            this.fetchInterval = setInterval(this.fetchBotInfo, 30000)
        }
    },
    unmounted() {
        if (this.fetchInterval) {
            clearInterval(this.fetchInterval)
        }
    },
    methods: {
        async fetchBotInfo() {
            try {
                const response = await api.get('/whatsapp-infos')
                this.botInfo = response.data
            } catch (error) {
                console.error('Erro ao buscar informações do bot do WhatsApp:', error)
            }
        },
        formatUptime(seconds) {
            const days = Math.floor(seconds / 86400)
            const hours = Math.floor((seconds % 86400) / 3600)
            const minutes = Math.floor((seconds % 3600) / 60)

            let uptimeString = ''
            if (days > 0) {
                uptimeString += `${days}d `
            }
            uptimeString += `${hours}h ${minutes}m`

            return uptimeString
        },
        handleLogout() {
            this.$store.dispatch('logout')
            this.$router.push('/login')
        },
        openChangePassword() {
            this.passwordForm = {
                senhaAtual: '',
                novaSenha: '',
                confirmarSenha: ''
            }
            this.passwordMessage = ''
            this.passwordMessageType = 'info'
            this.passwordModal.show()
        },
        async handleChangePassword() {
            if (this.passwordForm.novaSenha !== this.passwordForm.confirmarSenha) {
                this.passwordMessage = 'As senhas não conferem'
                this.passwordMessageType = 'danger'
                return
            }

            try {
                await AuthService.updatePassword(
                    this.passwordForm.senhaAtual,
                    this.passwordForm.novaSenha,
                    this.passwordForm.confirmarSenha
                )
                this.passwordMessage = 'Senha alterada com sucesso! Você será redirecionado para o login.'
                this.passwordMessageType = 'success'
                setTimeout(() => {
                    this.passwordModal.hide()
                    this.handleLogout()
                }, 2000)
            } catch (error) {
                this.passwordMessage = error.response?.data?.message || 'Erro ao alterar senha'
                this.passwordMessageType = 'danger'
            }
        }
    }
}
</script>

<style>
.navbar {
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
}

.dropdown-menu {
    background-color: #343a40;
    margin-top: 0.5rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.dropdown-item {
    color: white;
    padding: 0.5rem 1rem;
    transition: background-color 0.2s;
}

.dropdown-item:hover {
    background-color: #495057;
    color: white;
}

.dropdown-divider {
    border-top-color: rgba(255, 255, 255, 0.1);
}

.dropdown-menu-end {
    right: 0;
    left: auto;
}

.nav-link.router-link-active {
    font-weight: bold;
    color: #ffffff !important;
    background-color: #495057;
    border-radius: 5px;
}

.badge {
    font-size: 0.85rem;
    padding: 0.4em 0.6em;
}

.modal-content {
    border-radius: 8px;
}

.modal-header {
    background-color: #f8f9fa;
    border-radius: 8px 8px 0 0;
}

.form-control:focus {
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.btn-primary {
    background-color: #0d6efd;
    border-color: #0d6efd;
}

.btn-primary:hover {
    background-color: #0b5ed7;
    border-color: #0a58ca;
}

.btn-link {
    text-decoration: none;
    color: white;
}

.btn-link:hover {
    color: white;
    text-decoration: none;
}

.nav-link.dropdown-toggle::after {
    display: inline-block;
    margin-left: 0.255em;
    vertical-align: 0.255em;
    content: "";
    border-top: 0.3em solid;
    border-right: 0.3em solid transparent;
    border-bottom: 0;
    border-left: 0.3em solid transparent;
}
</style>