<template>
    <div id="roobot"></div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { initRoobot } from './roobot';

onMounted(() => {
    initRoobot();
})
</script>
<style lang="less" scoped></style>