<template>
    <div class="container my-5 p-4 border rounded shadow-sm bg-light">
        <h2 class="mb-4 text-center">Editar Wiki</h2>
        <form @submit.prevent="handleUpdate" class="needs-validation" novalidate>
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
                <button type="submit" class="btn btn-primary btn-lg">Atualizar Wiki</button>
            </div>
        </form>

        <p v-if="mensagem" class="mt-3 alert alert-info text-center">{{ mensagem }}</p>
    </div>
</template>

<script>
import api from '../services/api';

export default {
    props: ['id'],
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
        await this.carregarWiki();
        await this.carregarTurmas();
    },
    methods: {
        async carregarWiki() {
            try {
                const response = await api.get(`/wiki/${this.id}`);
                const wiki = response.data;
                this.titulo = wiki.titulo;
                this.conteudo = wiki.conteudo;
                this.turmaId = wiki.turma?._id;
            } catch (error) {
                console.error('Erro ao carregar wiki:', error);
                this.mensagem = 'Erro ao carregar wiki.';
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
                const wikiAtualizada = {
                    titulo: this.titulo,
                    conteudo: this.conteudo,
                    turma: this.turmaId
                };
                await api.put(`/wiki/${this.id}`, wikiAtualizada);
                this.mensagem = 'Wiki atualizada com sucesso!';
                this.$router.push({ name: 'WikiList' });
            } catch (error) {
                console.error('Erro ao atualizar wiki:', error);
                this.mensagem = 'Erro ao atualizar wiki. Tente novamente.';
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