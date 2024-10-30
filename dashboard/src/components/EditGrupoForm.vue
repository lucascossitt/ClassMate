<template>
    <div class="container my-5 p-4 border rounded shadow-sm bg-light">
        <h2 class="mb-4 text-center">Editar Grupo</h2>
        <form class="needs-validation" novalidate @submit.prevent="handleUpdate">
            <div class="mb-3">
                <label class="form-label">ID do Grupo</label>
                <input
                    :value="grupo.id"
                    class="form-control"
                    disabled
                    type="text"
                />
                <div class="form-text">
                    O ID do grupo é sincronizado automaticamente com o WhatsApp.
                </div>
            </div>

            <div class="mb-3">
                <label class="form-label">Nome do Grupo</label>
                <input
                    :value="grupo.nome"
                    class="form-control"
                    disabled
                    type="text"
                />
                <div class="form-text">
                    O nome do grupo é sincronizado automaticamente com o WhatsApp.
                </div>
            </div>

            <div class="mb-3">
                <label class="form-label" for="turmaId">Vincular Turma</label>
                <select
                    id="turmaId"
                    v-model="turmaId"
                    class="form-select">
                    <option value="">Nenhuma turma</option>
                    <option v-for="turma in turmas" :key="turma._id" :value="turma._id">
                        {{ turma.nome }}
                    </option>
                </select>
            </div>

            <div class="mb-3">
                <label class="form-label" for="termoPesquisa">Termo de Pesquisa do Laboratório</label>
                <input
                    id="termoPesquisa"
                    v-model="termoPesquisaLaboratorio"
                    class="form-control"
                    placeholder="Digite o termo de pesquisa do laboratório"
                    type="text"
                />
                <div class="form-text">
                    Este termo será usado para pesquisar a disponibilidade do laboratório.
                </div>
            </div>

            <div class="mb-3">
                <label class="form-label" for="anotacoes">Anotações</label>
                <textarea
                    id="anotacoes"
                    v-model="anotacoes"
                    class="form-control"
                    placeholder="Digite suas anotações sobre o grupo"
                    rows="4"
                ></textarea>
                <div class="form-text">
                    Use este espaço para fazer anotações importantes sobre o grupo.
                </div>
            </div>

            <div class="d-grid gap-2 mt-4">
                <button class="btn btn-primary btn-lg" type="submit">Atualizar Grupo</button>
            </div>
        </form>

        <p v-if="mensagem" class="mt-3 alert alert-info text-center">{{ mensagem }}</p>
    </div>
</template>

<script>
import api from '../services/api'

export default {
    props: ['id'],
    data() {
        return {
            grupo: {},
            turmaId: '',
            termoPesquisaLaboratorio: '',
            anotacoes: '',
            turmas: [],
            mensagem: ''
        }
    },
    async created() {
        await this.carregarGrupo()
        await this.carregarTurmas()
    },
    methods: {
        async carregarGrupo() {
            try {
                const response = await api.get(`/grupo/${this.id}`)
                this.grupo = response.data
                this.turmaId = this.grupo.turma?._id || ''
                this.termoPesquisaLaboratorio = this.grupo.termoPesquisaLaboratorio || ''
                this.anotacoes = this.grupo.anotacoes || ''
            } catch (error) {
                console.error('Erro ao carregar grupo:', error)
                this.mensagem = 'Erro ao carregar grupo.'
            }
        },
        async carregarTurmas() {
            try {
                const response = await api.get('/turma')
                this.turmas = response.data
            } catch (error) {
                console.error('Erro ao carregar turmas:', error)
            }
        },
        async handleUpdate() {
            try {
                const grupoAtualizado = {
                    turma: this.turmaId || null,
                    termoPesquisaLaboratorio: this.termoPesquisaLaboratorio || '',
                    anotacoes: this.anotacoes || ''
                }

                await api.put(`/grupo/${this.id}`, grupoAtualizado)
                this.mensagem = 'Grupo atualizado com sucesso!'

                setTimeout(() => {
                    this.$router.push({name: 'GrupoList'})
                }, 1500)
            } catch (error) {
                console.error('Erro ao atualizar grupo:', error)
                this.mensagem = 'Erro ao atualizar grupo. Tente novamente.'
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