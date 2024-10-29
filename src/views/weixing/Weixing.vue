<template>
    <div id="main" class="main"></div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { init } from './earth';

onMounted(() => {
    init();
});
</script>
<style lang="less" scoped></style>