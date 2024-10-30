<template>
    <div class="container my-5 p-4 border rounded shadow-sm bg-light">
        <h2 class="mb-4 text-center">Editar Lembrete</h2>
        <form @submit.prevent="handleUpdate" class="needs-validation" novalidate>
            <div class="mb-3">
                <label for="mensagem" class="form-label">Mensagem</label>
                <textarea
                    id="mensagem"
                    v-model="mensagem"
                    rows="3"
                    required
                    class="form-control"
                    placeholder="Edite a mensagem do lembrete"
                ></textarea>
                <div class="invalid-feedback">
                    Por favor, insira a mensagem.
                </div>
            </div>

            <div class="mb-3">
                <label for="dataHora" class="form-label">Data e Hora</label>
                <input
                    type="datetime-local"
                    v-model="dataHora"
                    required
                    class="form-control"
                    id="dataHora"
                />
                <div class="invalid-feedback">
                    Por favor, selecione uma data e hora.
                </div>
            </div>

            <div class="mb-3">
                <label for="turmaId" class="form-label">Selecionar Turma</label>
                <select
                    v-model="turmaId"
                    required
                    class="form-select"
                    id="turmaId">
                    <option value="" disabled>Selecione uma turma</option>
                    <option v-for="turma in turmas" :key="turma._id" :value="turma._id">
                        {{ turma.nome }}
                    </option>
                </select>
                <div class="invalid-feedback">
                    Por favor, selecione uma turma.
                </div>
            </div>

            <div class="d-grid gap-2 mt-4">
                <button type="submit" class="btn btn-primary btn-lg">Atualizar Lembrete</button>
            </div>
        </form>

        <p v-if="mensagemFeedback" class="mt-3 alert alert-info text-center">{{ mensagemFeedback }}</p>
    </div>
</template>

<script>
import api from '../services/api';

export default {
    props: ['id'],
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
        await this.carregarLembrete();
        await this.carregarTurmas();
    },
    methods: {
        async carregarLembrete() {
            try {
                const response = await api.get(`/lembrete/${this.id}`);
                const lembrete = response.data;
                this.mensagem = lembrete.mensagem;
                this.dataHora = this.formatarDataParaInput(lembrete.dataHora);
                this.turmaId = lembrete.turma?._id;
            } catch (error) {
                console.error('Erro ao carregar lembrete:', error);
                this.mensagemFeedback = 'Erro ao carregar lembrete.';
            }
        },
        async carregarTurmas() {
            try {
                const response = await api.get('/turma');
                this.turmas = response.data;
            } catch (error) {
                console.error('Erro ao carregar turmas:', error);
            }
        },
        async handleUpdate() {
            try {
                const lembreteAtualizado = {
                    mensagem: this.mensagem,
                    dataHora: this.dataHora,
                    turma: this.turmaId
                };
                await api.put(`/lembrete/${this.id}`, lembreteAtualizado);
                this.mensagemFeedback = 'Lembrete atualizado com sucesso!';
                this.$router.push({ name: 'LembreteList' });
            } catch (error) {
                console.error('Erro ao atualizar lembrete:', error);
                this.mensagemFeedback = 'Erro ao atualizar lembrete. Tente novamente.';
            }
        },
        formatarDataParaInput(data) {
            const dataObj = new Date(data);
            const year = dataObj.getFullYear();
            const month = String(dataObj.getMonth() + 1).padStart(2, '0');
            const day = String(dataObj.getDate()).padStart(2, '0');
            const hours = String(dataObj.getHours()).padStart(2, '0');
            const minutes = String(dataObj.getMinutes()).padStart(2, '0');
            return `${year}-${month}-${day}T${hours}:${minutes}`;
        }
    }
};
</script>

<style scoped>
.container {
    max-width: 600px;
}
</style>