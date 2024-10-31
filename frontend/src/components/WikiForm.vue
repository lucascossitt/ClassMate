<template>
    <div class="container my-5 p-4 border rounded shadow-sm bg-light">
        <h2 class="mb-4 text-center">Cadastrar Nova Wiki</h2>
        <form class="needs-validation" novalidate @submit.prevent="handleSubmit">
            <div class="mb-3">
                <label class="form-label" for="titulo">Título</label>
                <input
                    id="titulo"
                    v-model="titulo"
                    class="form-control"
                    placeholder="Digite o título da wiki"
                    required
                    type="text"
                />
                <div class="invalid-feedback">
                    Por favor, insira o título.
                </div>
            </div>

            <div class="mb-3">
                <label class="form-label" for="conteudo">Conteúdo</label>
                <textarea
                    id="conteudo"
                    v-model="conteudo"
                    class="form-control"
                    placeholder="Digite o conteúdo da wiki"
                    required
                    rows="5"
                ></textarea>
                <div class="invalid-feedback">
                    Por favor, insira o conteúdo.
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
                <button class="btn btn-primary btn-lg" type="submit">Cadastrar Wiki</button>
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
            titulo: '',
            conteudo: '',
            turmaId: '',
            turmas: [],
            mensagem: ''
        }
    },
    async created() {
        await this.carregarTurmas()
    },
    methods: {
        async handleSubmit() {
            try {
                const novaWiki = {
                    titulo: this.titulo,
                    conteudo: this.conteudo,
                    turma: this.turmaId
                }
                await api.post('/wiki', novaWiki)
                this.mensagem = 'Wiki cadastrada com sucesso!'
                setTimeout(() => {
                    this.$router.push({name: 'WikiList'})
                }, 1500)
            } catch (error) {
                console.error('Erro ao cadastrar wiki:', error)
                this.mensagem = 'Erro ao cadastrar wiki. Tente novamente.'
            }
        },
        async carregarTurmas() {
            try {
                const response = await api.get('/turma')
                this.turmas = response.data
            } catch (error) {
                console.error('Erro ao carregar turmas:', error)
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