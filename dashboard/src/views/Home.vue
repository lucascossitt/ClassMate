<template>
    <div class="container my-5">
        <!-- Boas-vindas e Introdução -->
        <div class="jumbotron text-center p-5 bg-light rounded shadow-sm mb-5">
            <h1 class="display-4">Bem-vindo ao ClassMate</h1>
            <p class="lead">Gerencie turmas, wikis, lembretes e monitore o bot do WhatsApp.</p>
        </div>

        <!-- Cards de Navegação -->
        <div class="row mb-5">
            <div class="col-md-3" v-for="card in navigationCards" :key="card.title">
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

        <!-- Informações do Bot de WhatsApp -->
        <div v-if="botInfo" class="whatsapp-info bg-light p-4 rounded shadow-sm text-center">
            <h3>Status do Bot do WhatsApp</h3>
            <p><strong>Grupos Ativos:</strong> {{ botInfo.groupCount }}</p>
            <p><strong>Mensagens Enviadas:</strong> {{ botInfo.messageCount }}</p>
            <p><strong>State:</strong> {{ botInfo.state}}</p>
            <p><strong>Tempo de Atividade:</strong> {{ formatUptime(botInfo.uptime) }}</p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            navigationCards: [
                {
                    title: 'Turmas',
                    icon: 'bi bi-people',
                    description: 'Acesse todas as turmas e organize suas atividades.',
                    link: '/turmas'
                },
                {
                    title: 'Wikis',
                    icon: 'bi bi-journal-text',
                    description: 'Visualize e edite o conteúdo colaborativo das turmas.',
                    link: '/wikis'
                },
                {
                    title: 'Lembretes',
                    icon: 'bi bi-bell',
                    description: 'Gerencie e consulte lembretes importantes.',
                    link: '/lembretes'
                },
                {
                    title: 'Configurações',
                    icon: 'bi bi-gear',
                    description: 'Ajuste preferências da conta e sistema.',
                    link: '/configuracoes'
                }
            ],
            botInfo: null
        };
    },
    mounted() {
        this.fetchBotInfo();
    },
    methods: {
        async fetchBotInfo() {
            try {
                const response = await fetch('/whatsapp-infos')
                this.botInfo = await response.json()
            } catch (error) {
                console.error('Erro ao buscar informações do bot do WhatsApp:', error);
            }
        },
        formatUptime(seconds) {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            return `${hours}h ${minutes}m`;
        }
    }
};
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