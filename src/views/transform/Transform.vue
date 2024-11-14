<template>
    <div id="transform" class="transform"></div>
</template>
<script setup lang="ts">
import proj4 from 'proj4';
import { onMounted, ref } from 'vue';
import { convertCN2000ToWGS84, initMap, } from './transform';
import mapboxgl, { Map } from 'mapbox-gl';
import { envelope, featureCollection, point, toMercator } from '@turf/turf';

const mapD = ref<mapboxgl.Map | null>(null);
onMounted(async () => {
    const map = initMap();

    mapD.value = map;
    map.on('style.load', () => {

    })
});
</script>
<style lang="less" scoped>
.transform {
    height: 100%;
    width: 100%;
}
</style>