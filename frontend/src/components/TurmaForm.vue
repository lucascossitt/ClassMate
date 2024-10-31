<template>
    <div class="container my-5 p-4 border rounded shadow-sm bg-light">
        <h2 class="mb-4 text-center">Cadastrar Nova Turma</h2>
        <form class="needs-validation" novalidate @submit.prevent="handleSubmit">
            <div class="mb-3">
                <label class="form-label" for="nome">Nome da Turma</label>
                <input
                    id="nome"
                    v-model="nome"
                    class="form-control"
                    placeholder="Digite o nome da turma"
                    required
                    type="text"
                />
                <div class="invalid-feedback">
                    Por favor, insira o nome da turma.
                </div>
            </div>

            <h3 class="mt-4">Horários de Aula</h3>
            <div v-for="(dia, index) in diasSemana" :key="index" class="mb-4">
                <h4 class="text-secondary">{{ dia.label }}</h4>

                <div class="mb-3">
                    <label class="form-label" for="primeiroHorario">Primeiro Horário</label>
                    <input
                        v-model="horarios[dia.key].primeiroHorario"
                        class="form-control"
                        placeholder="Ex: Matemática"
                        required
                        type="text"
                    />
                    <div class="invalid-feedback">
                        Por favor, insira o primeiro horário.
                    </div>
                </div>

                <div class="mb-3">
                    <label class="form-label" for="segundoHorario">Segundo Horário</label>
                    <input
                        v-model="horarios[dia.key].segundoHorario"
                        class="form-control"
                        placeholder="Ex: Física"
                        required
                        type="text"
                    />
                    <div class="invalid-feedback">
                        Por favor, insira o segundo horário.
                    </div>
                </div>
            </div>

            <div class="d-grid gap-2 mt-4">
                <button class="btn btn-primary btn-lg" type="submit">Cadastrar Turma</button>
            </div>
        </form>

        <p v-if="mensagem" class="mt-3 alert alert-info text-center">{{ mensagem }}</p>
    </div>
</template>

<script>
import api from '../services/api'

export default {
    data() {
        return {
            nome: '',
            horarios: {
                segunda: {primeiroHorario: '', segundoHorario: ''},
                terca: {primeiroHorario: '', segundoHorario: ''},
                quarta: {primeiroHorario: '', segundoHorario: ''},
                quinta: {primeiroHorario: '', segundoHorario: ''},
                sexta: {primeiroHorario: '', segundoHorario: ''},
            },
            mensagem: '',
            diasSemana: [
                {key: 'segunda', label: 'Segunda-feira'},
                {key: 'terca', label: 'Terça-feira'},
                {key: 'quarta', label: 'Quarta-feira'},
                {key: 'quinta', label: 'Quinta-feira'},
                {key: 'sexta', label: 'Sexta-feira'},
            ]
        }
    },
    methods: {
        async handleSubmit() {
            try {
                const novaTurma = {
                    nome: this.nome,
                    horarios: this.horarios
                }
                await api.post('/turma', novaTurma)
                this.mensagem = 'Turma cadastrada com sucesso!'
                setTimeout(() => {
                    this.$router.push({name: 'TurmaList'})
                }, 1500)
            } catch (error) {
                console.error('Erro ao cadastrar turma:', error)
                this.mensagem = 'Erro ao cadastrar turma. Tente novamente.'
            }
        }
    }
}
</script>

<style scoped>
.container {
    max-width: 600px;
}
</style>