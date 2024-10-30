<template>
    <div class="container my-5">
        <h2 class="mb-4 text-center">Lista de Grupos</h2>

        <table v-if="grupos.length > 0" class="table table-striped table-bordered table-hover align-middle">
            <thead class="table-dark">
            <tr>
                <th scope="col">Nome do Grupo</th>
                <th scope="col">Turma Vinculada</th>
                <th scope="col">Termo de Pesquisa</th>
                <th scope="col">Ações</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="grupo in grupos" :key="grupo._id">
                <td>{{ grupo.nome }}</td>
                <td>{{ grupo.turma ? grupo.turma.nome : 'Não vinculada' }}</td>
                <td>{{ grupo.termoPesquisaLaboratorio || 'Não definido' }}</td>
                <td>
                    <div aria-label="Ações do grupo" class="btn-group" role="group">
                        <button class="btn btn-primary btn-sm" title="Editar Grupo" @click="editarGrupo(grupo._id)">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" title="Excluir Grupo" @click="excluirGrupo(grupo._id)">
                            <i class="bi bi-trash"></i>
                        </button>
                        <button
                            :disabled="!grupo.anotacoes"
                            class="btn btn-info btn-sm"
                            title="Ver Anotações"
                            @click="verAnotacoes(grupo)"
                        >
                            <i class="bi bi-journal-text"></i>
                        </button>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>

        <p v-else class="text-center mt-3">Nenhum grupo encontrado.</p>

        <div id="anotacoesModal" aria-hidden="true" aria-labelledby="anotacoesModalLabel" class="modal fade"
             tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 id="anotacoesModalLabel" class="modal-title">
                            Anotações do Grupo: {{ grupoSelecionado?.nome }}
                        </h5>
                        <button aria-label="Fechar" class="btn-close" data-bs-dismiss="modal" type="button"></button>
                    </div>
                    <div class="modal-body">
                        <p style="white-space: pre-line">{{ grupoSelecionado?.anotacoes }}</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" data-bs-dismiss="modal" type="button">Fechar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from '../services/api'
import {Modal} from 'bootstrap'

export default {
    data() {
        return {
            grupos: [],
            grupoSelecionado: null,
            modal: null
        }
    },
    async created() {
        await this.carregarGrupos()
    },
    mounted() {
        this.modal = new Modal(document.getElementById('anotacoesModal'))
    },
    methods: {
        async carregarGrupos() {
            try {
                const response = await api.get('/grupo')
                this.grupos = response.data
            } catch (error) {
                console.error('Erro ao carregar grupos:', error)
            }
        },
        editarGrupo(id) {
            this.$router.push({name: 'EditGrupo', params: {id}})
        },
        async excluirGrupo(id) {
            if (confirm('Tem certeza que deseja excluir este grupo?')) {
                try {
                    await api.delete(`/grupo/${id}`)
                    await this.carregarGrupos()
                } catch (error) {
                    console.error('Erro ao excluir grupo:', error)
                }
            }
        },
        verAnotacoes(grupo) {
            this.grupoSelecionado = grupo
            this.modal.show()
        }
    }
}
</script>

<style scoped>
.container {
    max-width: 800px;
}

.modal-body p {
    margin: 0;
    text-align: justify;
}
</style>