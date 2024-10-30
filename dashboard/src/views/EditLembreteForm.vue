<template>
    <div>
        <EditLembrete :id="$route.params.id" />
    </div>
</template>

<script>
import EditLembrete from '../components/EditLembreteForm.vue';

export default {
    components: {
        EditLembrete,
    },
};
</script>