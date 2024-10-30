<template>
    <div class="container my-5">
        <h2 class="mb-4 text-center">Lista de Lembretes</h2>
        <table v-if="lembretes.length > 0" class="table table-striped table-bordered table-hover align-middle">
            <thead class="table-dark">
            <tr>
                <th scope="col">Mensagem</th>
                <th scope="col">Data e Hora</th>
                <th scope="col">Turma</th>
                <th scope="col">Ações</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="lembrete in lembretes" :key="lembrete._id">
                <td>{{ lembrete.mensagem }}</td>
                <td>{{ formatarDataHora(lembrete.dataHora) }}</td>
                <td>{{ lembrete.turma ? lembrete.turma.nome : 'Não associada' }}</td>
                <td>
                    <div class="btn-group" role="group" aria-label="Ações do lembrete">
                        <button @click="excluirLembrete(lembrete._id)" class="btn btn-danger btn-sm" title="Excluir Lembrete">
                            <i class="bi bi-trash"></i>
                        </button>
                        <router-link :to="{ name: 'EditLembrete', params: { id: lembrete._id } }">
                            <button class="btn btn-primary btn-sm" title="Editar Lembrete">
                                <i class="bi bi-pencil-square"></i>
                            </button>
                        </router-link>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
        <p v-else class="text-center mt-3">Nenhum lembrete cadastrado.</p>
        <p v-if="mensagem" class="alert alert-info mt-3">{{ mensagem }}</p>
    </div>
</template>

<script>
import api from '../services/api';

export default {
    data() {
        return {
            lembretes: [],
            mensagem: ''
        };
    },
    async created() {
        const turmaId = this.$route.query.turmaId;
        await this.carregarLembretes(turmaId);
    },
    methods: {
        async carregarLembretes(turmaId) {
            try {
                const response = await api.get('/lembrete', {
                    params: turmaId ? { turmaId: turmaId } : {}
                });
                this.lembretes = response.data;
            } catch (error) {
                console.error('Erro ao carregar lembretes:', error);
                this.mensagem = 'Erro ao carregar lembretes. Tente novamente.';
            }
        },
        async excluirLembrete(id) {
            if (confirm('Tem certeza que deseja excluir este lembrete?')) {
                try {
                    await api.delete(`/lembrete/${id}`);
                    this.mensagem = 'Lembrete excluído com sucesso.';
                    this.lembretes = this.lembretes.filter(lembrete => lembrete._id !== id);
                } catch (error) {
                    console.error('Erro ao excluir lembrete:', error);
                    this.mensagem = 'Erro ao excluir lembrete. Tente novamente.';
                }
            }
        },
        formatarDataHora(dataHora) {
            const data = new Date(dataHora);
            return data.toLocaleString('pt-BR');
        }
    },
    watch: {
        '$route.query.turmaId': {
            immediate: true,
            handler(newId) {
                this.carregarLembretes(newId);
            }
        }
    }
};
</script>

<style scoped>
.container {
    max-width: 800px;
}
</style>