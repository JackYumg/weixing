<template>
  <div id="main" class="main"></div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { Earth } from './earth';

const earth = new Earth(
  'main',
  document.body.clientWidth,
  document.body.clientHeight,
);
onMounted(() => {
  earth.subscribe('cailiao-loaded', () => {
    earth.create();
  });
});
</script>
<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%;
}
</style>
