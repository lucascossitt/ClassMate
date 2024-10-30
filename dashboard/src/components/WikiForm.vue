<template>
    <div class="container my-5 p-4 border rounded shadow-sm bg-light">
        <h2 class="mb-4 text-center">Cadastrar Nova Wiki</h2>
        <form @submit.prevent="handleSubmit" class="needs-validation" novalidate>
            <div class="mb-3">
                <label for="titulo" class="form-label">Título</label>
                <input
                    type="text"
                    v-model="titulo"
                    required
                    class="form-control"
                    id="titulo"
                    placeholder="Digite o título da wiki"
                />
                <div class="invalid-feedback">
                    Por favor, insira o título.
                </div>
            </div>

            <div class="mb-3">
                <label for="conteudo" class="form-label">Conteúdo</label>
                <textarea
                    id="conteudo"
                    v-model="conteudo"
                    rows="5"
                    required
                    class="form-control"
                    placeholder="Digite o conteúdo da wiki"
                ></textarea>
                <div class="invalid-feedback">
                    Por favor, insira o conteúdo.
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
                <button type="submit" class="btn btn-primary btn-lg">Cadastrar Wiki</button>
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
            titulo: '',
            conteudo: '',
            turmaId: '',
            turmas: [],
            mensagem: ''
        };
    },
    async created() {
        await this.carregarTurmas();
    },
    methods: {
        async handleSubmit() {
            try {
                const novaWiki = {
                    titulo: this.titulo,
                    conteudo: this.conteudo,
                    turma: this.turmaId
                };
                await api.post('/wiki', novaWiki);
                this.mensagem = 'Wiki cadastrada com sucesso!';
                this.$router.push({ name: 'WikiList' });
            } catch (error) {
                console.error('Erro ao cadastrar wiki:', error);
                this.mensagem = 'Erro ao cadastrar wiki. Tente novamente.';
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