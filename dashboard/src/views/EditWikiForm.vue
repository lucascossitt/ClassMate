<template>
    <div>
        <EditWiki :id="$route.params.id" />
    </div>
</template>

<script>
import EditWiki from '../components/EditWikiForm.vue';

export default {
    components: {
        EditWiki,
    },
};
</script>