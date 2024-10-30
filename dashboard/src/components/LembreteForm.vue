<template>
    <div class="container my-5 p-4 border rounded shadow-sm bg-light">
        <h2 class="mb-4 text-center">Cadastrar Novo Lembrete</h2>
        <form class="needs-validation" novalidate @submit.prevent="handleSubmit">
            <div class="mb-3">
                <label class="form-label" for="mensagem">Mensagem</label>
                <textarea
                    id="mensagem"
                    v-model="mensagem"
                    class="form-control"
                    placeholder="Escreva o lembrete aqui..."
                    required
                    rows="3"
                ></textarea>
                <div class="invalid-feedback">
                    Por favor, insira uma mensagem.
                </div>
            </div>

            <div class="mb-3">
                <label class="form-label" for="dataHora">Data e Hora</label>
                <input
                    id="dataHora"
                    v-model="dataHora"
                    class="form-control"
                    required
                    type="datetime-local"
                />
                <div class="invalid-feedback">
                    Por favor, selecione uma data e hora.
                </div>
            </div>

            <div class="mb-3">
                <label class="form-label" for="turmaId">Selecionar Turma</label>
                <select
                    id="turmaId"
                    v-model="turmaId"
                    class="form-select"
                    required>
                    <option disabled value="">Selecione uma turma</option>
                    <option v-for="turma in turmas" :key="turma._id" :value="turma._id">
                        {{ turma.nome }}
                    </option>
                </select>
                <div class="invalid-feedback">
                    Por favor, selecione uma turma.
                </div>
            </div>

            <div class="d-grid gap-2 mt-4">
                <button class="btn btn-primary btn-lg" type="submit">Cadastrar Lembrete</button>
            </div>
        </form>

        <p v-if="mensagemFeedback" class="mt-3 alert alert-info text-center">{{ mensagemFeedback }}</p>
    </div>
</template>

<script>
import api from '../services/api';

export default {
    data() {
        return {
            mensagem: '',
            dataHora: '',
            turmaId: '',
            turmas: [],
            mensagemFeedback: ''
        };
    },
    async created() {
        await this.carregarTurmas();
    },
    methods: {
        async handleSubmit() {
            try {
                const novoLembrete = {
                    mensagem: this.mensagem,
                    dataHora: this.dataHora,
                    turma: this.turmaId
                };
                await api.post('/lembrete', novoLembrete);
                this.mensagemFeedback = 'Lembrete cadastrado com sucesso!';
                this.$router.push({ name: 'LembreteList' });
            } catch (error) {
                console.error('Erro ao cadastrar lembrete:', error);
                this.mensagemFeedback = 'Erro ao cadastrar lembrete. Tente novamente.';
            }
        },
        async carregarTurmas() {
            try {
                const response = await api.get('/turma');
                this.turmas = response.data;
            } catch (error) {
                console.error('Erro ao carregar turmas:', error);
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