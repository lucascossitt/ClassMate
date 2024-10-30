<template>
    <div class="container my-5">
        <h2 class="mb-4 text-center">Lista de Wikis</h2>
        <table v-if="wikis.length > 0" class="table table-striped table-bordered table-hover align-middle">
            <thead class="table-dark">
            <tr>
                <th scope="col">Título</th>
                <th scope="col">Conteúdo</th>
                <th scope="col">Data de Criação</th>
                <th scope="col">Turma</th>
                <th scope="col">Ações</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="wiki in wikis" :key="wiki._id">
                <td>{{ wiki.titulo }}</td>
                <td>{{ wiki.conteudo }}</td>
                <td>{{ formatarData(wiki.dataCriacao) }}</td>
                <td>{{ wiki.turma ? wiki.turma.nome : 'Não associada' }}</td>
                <td>
                    <div class="btn-group" role="group" aria-label="Ações da wiki">
                        <button @click="excluirWiki(wiki._id)" class="btn btn-danger btn-sm" title="Excluir Wiki">
                            <i class="bi bi-trash"></i>
                        </button>
                        <router-link :to="{ name: 'EditWiki', params: { id: wiki._id } }">
                            <button class="btn btn-primary btn-sm" title="Editar Wiki">
                                <i class="bi bi-pencil-square"></i>
                            </button>
                        </router-link>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
        <p v-else class="text-center mt-3">Nenhuma wiki cadastrada.</p>
        <p v-if="mensagem" class="alert alert-info mt-3">{{ mensagem }}</p>
    </div>
</template>

<script>
import api from '../services/api';

export default {
    data() {
        return {
            wikis: [],
            mensagem: '',
        };
    },
    async created() {
        const turmaId = this.$route.query.turmaId;
        await this.carregarWikis(turmaId);
    },
    methods: {
        async carregarWikis(turmaId) {
            try {
                const response = await api.get('/wiki', {
                    params: turmaId ? { turmaId: turmaId } : {}
                });
                this.wikis = response.data;
            } catch (error) {
                console.error('Erro ao carregar wikis:', error);
                this.mensagem = 'Erro ao carregar wikis. Tente novamente.';
            }
        },
        async excluirWiki(id) {
            if (confirm('Tem certeza que deseja excluir esta wiki?')) {
                try {
                    await api.delete(`/wiki/${id}`);
                    this.mensagem = 'Wiki excluída com sucesso.';
                    this.wikis = this.wikis.filter(wiki => wiki._id !== id);
                } catch (error) {
                    console.error('Erro ao excluir wiki:', error);
                    this.mensagem = 'Erro ao excluir wiki. Tente novamente.';
                }
            }
        },
        formatarData(dataCriacao) {
            const data = new Date(dataCriacao);
            return data.toLocaleDateString('pt-BR');
        },
    },
    watch: {
        '$route.query.turmaId': {
            immediate: true,
            handler(newId) {
                this.carregarWikis(newId);
            }
        }
    }
};
</script>