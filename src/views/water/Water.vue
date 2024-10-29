<template>
    <div class="water" id="water"></div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { init } from './water';


onMounted(() => {
    init();
});
</script>
<style lang="less" scoped></style>