<template>
    <div class="container my-5">
        <h2 class="mb-4 text-center">Lista de Turmas</h2>

        <!-- Exibe a tabela apenas se houver turmas -->
        <table v-if="turmas.length > 0" class="table table-striped table-bordered table-hover align-middle">
            <thead class="table-dark">
            <tr>
                <th scope="col">Nome da Turma</th>
                <th scope="col">Ações</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="turma in turmas" :key="turma._id">
                <td>{{ turma.nome }}</td>
                <td>
                    <div class="btn-group" role="group" aria-label="Ações da turma">
                        <button @click="editarTurma(turma._id)" class="btn btn-primary btn-sm" title="Editar Turma">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button @click="excluirTurma(turma._id)" class="btn btn-danger btn-sm" title="Excluir Turma">
                            <i class="bi bi-trash"></i>
                        </button>
                        <button @click="verWikis(turma._id)" class="btn btn-secondary btn-sm" title="Ver Wikis">
                            <i class="bi bi-journal-text"></i>
                        </button>
                        <button @click="verLembretes(turma._id)" class="btn btn-info btn-sm" title="Ver Lembretes">
                            <i class="bi bi-bell"></i>
                        </button>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>

        <!-- Exibe mensagem quando não houver turmas -->
        <p v-else class="text-center mt-3">Nenhuma turma cadastrada.</p>
    </div>
</template>

<script>
import api from '../services/api';

export default {
    data() {
        return {
            turmas: []
        };
    },
    async created() {
        await this.carregarTurmas();
    },
    methods: {
        async carregarTurmas() {
            try {
                const response = await api.get('/turma');
                this.turmas = response.data;
            } catch (error) {
                console.error('Erro ao carregar turmas:', error);
            }
        },
        editarTurma(id) {
            this.$router.push({name: 'EditTurma', params: {id}});
        },
        excluirTurma(id) {
            if (confirm('Tem certeza que deseja excluir esta turma?')) {
                api.delete(`/turma/${id}`)
                    .then(() => this.carregarTurmas())
                    .catch(error => console.error('Erro ao excluir turma:', error));
            }
        },
        verWikis(id) {
            this.$router.push({name: 'WikiList', query: {turmaId: id}});
        },
        verLembretes(id) {
            this.$router.push({name: 'LembreteList', query: {turmaId: id}});
        }
    }
};
</script>

<style scoped>
.container {
    max-width: 800px;
}
</style>