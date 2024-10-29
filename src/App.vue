<script setup lang="ts">
import { RouterView } from 'vue-router';

</script>

<template>
  <router-view></router-view>
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
