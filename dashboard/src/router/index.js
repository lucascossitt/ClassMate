import {createRouter, createWebHistory} from 'vue-router'

import HomeView from '../views/Home.vue'
import TurmaListView from '../views/TurmaList.vue'
import TurmaFormView from '../views/TurmaForm.vue'
import EditTurma from '../views/EditTurmaForm.vue'
import WikiListView from '../views/WikiList.vue'
import WikiFormView from '../views/WikiForm.vue'
import EditWiki from '../views/EditWikiForm.vue'
import LembreteListView from '../views/LembreteList.vue'
import LembreteFormView from '../views/LembreteForm.vue'
import EditLembrete from '../views/EditLembreteForm.vue'
import GrupoList from '../views/GrupoList.vue'
import EditGrupoForm from '../views/EditGrupoForm.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {path: '/', name: 'Home', component: HomeView},
        {path: '/turmas', name: 'TurmaList', component: TurmaListView},
        {path: '/turmas/cadastrar', name: 'TurmaForm', component: TurmaFormView},
        {path: '/turmas/editar/:id', name: 'EditTurma', component: EditTurma, props: true},
        {path: '/wikis', name: 'WikiList', component: WikiListView},
        {path: '/wikis/cadastrar', name: 'WikiForm', component: WikiFormView},
        {path: '/wikis/editar/:id', name: 'EditWiki', component: EditWiki, props: true},
        {path: '/lembretes', name: 'LembreteList', component: LembreteListView},
        {path: '/lembretes/cadastrar', name: 'LembreteForm', component: LembreteFormView},
        {path: '/lembretes/editar/:id', name: 'EditLembrete', component: EditLembrete, props: true},
        {path: '/grupos', name: 'GrupoList', component: GrupoList},
        {path: '/grupos/editar/:id', name: 'EditGrupo', component: EditGrupoForm, props: true}
    ]
})

export default router
