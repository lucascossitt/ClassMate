<template>
    <div id="app">
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow-sm">
            <div class="container-fluid"> <!-- Alterado para remover espaço -->
                <router-link class="navbar-brand ms-2" to="/">ClassMate</router-link>

                <button aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation" class="navbar-toggler"
                        data-bs-target="#navbarNav" data-bs-toggle="collapse" type="button">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div id="navbarNav" class="collapse navbar-collapse">
                    <ul class="navbar-nav me-auto">
                        <li class="nav-item">
                            <router-link class="nav-link" to="/turmas">Turmas</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/lembretes">Lembretes</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/wikis">Wikis</router-link>
                        </li>
                    </ul>
                    <!-- User Menu on the Right Side -->
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item dropdown">
                            <a
                                id="userDropdown"
                                aria-expanded="false"
                                class="nav-link dropdown-toggle"
                                data-bs-toggle="dropdown"
                                href="#"
                                role="button"
                            >
                                Usuário Logado
                            </a>
                            <ul aria-labelledby="userDropdown"
                                class="dropdown-menu dropdown-menu-end bg-dark text-light">
                                <li>
                                    <router-link class="dropdown-item text-light" to="/configuracoes">Configurações
                                    </router-link>
                                </li>
                                <li>
                                    <hr class="dropdown-divider">
                                </li>
                                <li><a class="dropdown-item text-light" href="#" @click="logout">Logout</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

        <router-view/>
    </div>
</template>

<script>
export default {
    name: 'App',
    methods: {
        logout() {
            console.log("Usuário deslogado.");
            this.$router.push('/login');
        }
    }
};
</script>

<style scoped>
.navbar {
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
}

.dropdown-menu {
    background-color: #343a40;
}

.dropdown-item:hover {
    background-color: #495057;
}

.nav-link.router-link-active {
    font-weight: bold; /* Destaca o link ativo */
    color: #ffffff; /* Ajuste a cor como preferir */
    background-color: #495057; /* Fundo para realce (opcional) */
    border-radius: 5px; /* Arredondamento opcional */
}
</style>