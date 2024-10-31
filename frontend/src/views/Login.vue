<template>
    <div class="container my-5 p-4 border rounded shadow-sm bg-light">
        <h2 class="mb-4 text-center">Login</h2>
        <form @submit.prevent="handleLogin">
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                    v-model="email"
                    type="email"
                    class="form-control"
                    id="email"
                    placeholder="Digite seu email"
                    required
                />
                <div class="invalid-feedback">
                    Por favor, insira seu email.
                </div>
            </div>

            <div class="mb-3">
                <label for="senha" class="form-label">Senha</label>
                <input
                    v-model="senha"
                    type="password"
                    class="form-control"
                    id="senha"
                    placeholder="Digite sua senha"
                    required
                />
                <div class="invalid-feedback">
                    Por favor, insira sua senha.
                </div>
            </div>

            <div class="d-grid gap-2 mt-4">
                <button class="btn btn-primary btn-lg" type="submit">
                    Login
                </button>
            </div>
        </form>

        <div v-if="showError" class="mt-3 alert alert-danger text-center">
            {{ message }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'Login',
    data() {
        return {
            email: '',
            senha: '',
            message: '',
            showError: false
        }
    },
    methods: {
        async handleLogin() {
            try {
                const user = await this.$store.dispatch('login', {
                    email: this.email,
                    senha: this.senha
                })
                this.$router.push('/')
                this.email = ''
                this.senha = ''
                this.showError = false
            } catch (error) {
                this.message = error.response?.data?.message || 'Erro ao fazer login'
                this.showError = true
            }
        }
    },
    created() {
        if (this.$store.getters.isLoggedIn) {
            this.$router.push('/')
        }
    }
}
</script>

<style scoped>
.container {
    max-width: 600px;
}
</style>