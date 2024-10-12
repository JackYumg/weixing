<script setup lang="ts">
import { onMounted } from 'vue';
import { init } from './util/earth';
import { test } from './util/test';

onMounted(() => {
  init();
});
</script>

<template>
  <div class="main" id="main">

  </div>
</template>

<style scoped lang="less">
.main {
  height: 100%;
  width: 100%;
  background-size: contain;

  canvas {
    height: 100%;
    width: 100%;
  }
}
</style>
