<template>
    <div class="container my-5">
        <h2 class="mb-4 text-center">Lista de Turmas</h2>
        <table v-if="turmas.length > 0" class="table table-striped table-bordered table-hover align-middle">
            <thead class="table-dark">
            <tr>
                <th scope="col">Nome da Turma</th>
                <th scope="col">Grupo WhatsApp</th>
                <th scope="col">Ações</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="turma in turmas" :key="turma._id">
                <td>{{ turma.nome }}</td>
                <td>
                    <span v-if="getGrupoVinculado(turma._id)">
                        {{ getGrupoVinculado(turma._id).nome }}
                    </span>
                    <span v-else class="text-muted">
                        Nenhum grupo vinculado
                    </span>
                </td>
                <td>
                    <div aria-label="Ações da turma" class="btn-group" role="group">
                        <button class="btn btn-primary btn-sm" title="Editar Turma" @click="editarTurma(turma._id)">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" title="Excluir Turma" @click="excluirTurma(turma._id)">
                            <i class="bi bi-trash"></i>
                        </button>
                        <button class="btn btn-secondary btn-sm" title="Ver Wikis" @click="verWikis(turma._id)">
                            <i class="bi bi-journal-text"></i>
                        </button>
                        <button class="btn btn-info btn-sm" title="Ver Lembretes" @click="verLembretes(turma._id)">
                            <i class="bi bi-bell"></i>
                        </button>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
        <p v-else class="text-center mt-3">Nenhuma turma cadastrada.</p>
    </div>
</template>

<script>
import api from '../services/api'

export default {
    data() {
        return {
            turmas: [],
            grupos: [] 
        }
    },
    async created() {
        await this.carregarTurmas()
        await this.carregarGrupos() 
    },
    methods: {
        async carregarTurmas() {
            try {
                const response = await api.get('/turma')
                this.turmas = response.data
            } catch (error) {
                console.error('Erro ao carregar turmas:', error)
            }
        },
        async carregarGrupos() {
            try {
                const response = await api.get('/grupo')
                this.grupos = response.data
            } catch (error) {
                console.error('Erro ao carregar grupos:', error)
            }
        },
        getGrupoVinculado(turmaId) {
            
            return this.grupos.find(grupo => grupo.turma?._id === turmaId)
        },
        editarTurma(id) {
            this.$router.push({name: 'EditTurma', params: {id}})
        },
        excluirTurma(id) {
            if (confirm('Tem certeza que deseja excluir esta turma?')) {
                api.delete(`/turma/${id}`)
                    .then(() => this.carregarTurmas())
                    .catch(error => console.error('Erro ao excluir turma:', error))
            }
        },
        verWikis(id) {
            this.$router.push({name: 'WikiList', query: {turmaId: id}})
        },
        verLembretes(id) {
            this.$router.push({name: 'LembreteList', query: {turmaId: id}})
        }
    }
}
</script>

<style scoped>
.container {
    max-width: 800px;
}
</style>