<template>
    <div class="container my-5 p-4 border rounded shadow-sm bg-light">
        <h2 class="mb-4 text-center">Cadastrar Nova Turma</h2>
        <form @submit.prevent="handleSubmit" class="needs-validation" novalidate>
            <div class="mb-3">
                <label for="nome" class="form-label">Nome da Turma</label>
                <input
                    type="text"
                    v-model="nome"
                    required
                    class="form-control"
                    id="nome"
                    placeholder="Digite o nome da turma"
                />
                <div class="invalid-feedback">
                    Por favor, insira o nome da turma.
                </div>
            </div>

            <h3 class="mt-4">Horários de Aula</h3>
            <div v-for="(dia, index) in diasSemana" :key="index" class="mb-4">
                <h4 class="text-secondary">{{ dia.label }}</h4>

                <div class="mb-3">
                    <label for="primeiroHorario" class="form-label">Primeiro Horário</label>
                    <input
                        type="text"
                        v-model="horarios[dia.key].primeiroHorario"
                        class="form-control"
                        placeholder="Ex: Matemática"
                        required
                    />
                    <div class="invalid-feedback">
                        Por favor, insira o primeiro horário.
                    </div>
                </div>

                <div class="mb-3">
                    <label for="segundoHorario" class="form-label">Segundo Horário</label>
                    <input
                        type="text"
                        v-model="horarios[dia.key].segundoHorario"
                        class="form-control"
                        placeholder="Ex: Física"
                        required
                    />
                    <div class="invalid-feedback">
                        Por favor, insira o segundo horário.
                    </div>
                </div>
            </div>

            <div class="d-grid gap-2 mt-4">
                <button type="submit" class="btn btn-primary btn-lg">Cadastrar Turma</button>
            </div>
        </form>

        <p v-if="mensagem" class="mt-3 alert alert-info text-center">{{ mensagem }}</p>
    </div>
</template>

<script>
import api from '../services/api';

export default {
    data() {
        return {
            nome: '',
            horarios: {
                segunda: { primeiroHorario: '', segundoHorario: '' },
                terca: { primeiroHorario: '', segundoHorario: '' },
                quarta: { primeiroHorario: '', segundoHorario: '' },
                quinta: { primeiroHorario: '', segundoHorario: '' },
                sexta: { primeiroHorario: '', segundoHorario: '' },
            },
            mensagem: '',
            diasSemana: [
                { key: 'segunda', label: 'Segunda-feira' },
                { key: 'terca', label: 'Terça-feira' },
                { key: 'quarta', label: 'Quarta-feira' },
                { key: 'quinta', label: 'Quinta-feira' },
                { key: 'sexta', label: 'Sexta-feira' },
            ]
        };
    },
    methods: {
        async handleSubmit() {
            try {
                const novaTurma = {
                    nome: this.nome,
                    horarios: this.horarios
                };
                await api.post('/turma', novaTurma);
                this.mensagem = 'Turma cadastrada com sucesso!';
                this.$router.push({ name: 'TurmaList' });
            } catch (error) {
                console.error('Erro ao cadastrar turma:', error);
                this.mensagem = 'Erro ao cadastrar turma. Tente novamente.';
            }
        }
    }
};
</script>

<style scoped>
.container {
    max-width: 600px;
}
</style>