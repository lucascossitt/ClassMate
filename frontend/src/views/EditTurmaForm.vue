<template>
    <div>
        <EditTurma :id="$route.params.id"/>
    </div>
</template>

<script>
import EditTurma from '../components/EditTurmaForm.vue'

export default {
    components: {
        EditTurma,
    },
}
</script>