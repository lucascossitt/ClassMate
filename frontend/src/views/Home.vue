<template>
    <div class="container my-5">
        <div class="jumbotron text-center p-5 bg-light rounded shadow-sm mb-5">
            <h1 class="display-4">Bem-vindo ao ClassMate</h1>
            <p class="lead">Gerencie turmas, wikis, lembretes e monitore o bot do WhatsApp.</p>
        </div>
        <div class="row mb-5">
            <div v-for="card in navigationCards" :key="card.title" class="col-md-3">
                <div class="card shadow-sm mb-4">
                    <div class="card-body text-center">
                        <i :class="card.icon + ' display-4'"></i>
                        <h5 class="card-title mt-3">{{ card.title }}</h5>
                        <p class="card-text">{{ card.description }}</p>
                        <router-link :to="card.link" class="btn btn-primary">Acessar</router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from '../services/api'

export default {
    data() {
        return {
            stats: { grupoCount: 0, lembreteCount: 0, turmaCount: 0, wikiCount: 0 }
        }
    },
    mounted() {
        this.fetchStats()
    },
    computed: {
        navigationCards() {
            return [
                {
                    title: `${this.stats.grupoCount} Grupos`,
                    icon: 'bi bi-whatsapp',
                    description: 'Gerencie os grupos do WhatsApp e suas vinculações.',
                    link: '/grupos'
                },
                {
                    title: `${this.stats.turmaCount} Turmas`,
                    icon: 'bi bi-people',
                    description: 'Acesse todas as turmas e organize suas atividades.',
                    link: '/turmas'
                },
                {
                    title: `${this.stats.wikiCount} Wikis`,
                    icon: 'bi bi-journal-text',
                    description: 'Visualize e edite o conteúdo colaborativo das turmas.',
                    link: '/wikis'
                },
                {
                    title: `${this.stats.lembreteCount} Lembretes`,
                    icon: 'bi bi-bell',
                    description: 'Gerencie e consulte lembretes importantes.',
                    link: '/lembretes'
                }
            ]
        }
    },
    methods: {
        async fetchStats() {
            try {
                const response = await api.get('/stats')
                this.stats = await response.data
            } catch (error) {
                console.error('Erro ao buscar informações dos stats:', error)
            }
        }
    }
}
</script>

<style scoped>
.jumbotron {
    background-color: #f8f9fa;
    color: #343a40;
    border-radius: 8px;
}

.card {
    border: none;
}

.card-body {
    padding: 2rem;
}

.card i {
    color: #007bff;
}

.whatsapp-info {
    margin-top: 2rem;
    border-left: 4px solid #007bff;
}
</style>