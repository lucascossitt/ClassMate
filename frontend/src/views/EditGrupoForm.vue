<template>
    <div>
        <EditGrupo :id="$route.params.id"/>
    </div>
</template>

<script>
import EditGrupo from '../components/EditGrupoForm.vue'

export default {
    components: {
        EditGrupo,
    },
}
</script>