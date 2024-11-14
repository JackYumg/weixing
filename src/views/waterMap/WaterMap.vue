<template>
    <div class="waterMap" id="waterMap"></div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { initMap } from './waterMap';
import { WaterLayer } from './WaterLayer';
import * as mapboxgl from 'mapbox-gl'

onMounted(() => {
    const { map } = initMap();
    map.on('style.load', () => {
        addriverLayer(map);
    })
});

function addriverLayer(map: mapboxgl.Map) {
    const waterLayer = new WaterLayer({
        id: 'waterLayer',
        points:
            [
                [
                    53.39843749999869,
                    49.09545216253633
                ],
                [
                    53.39843749999869,
                    26.82407078047224
                ],
                [
                    86.62109374999903,
                    26.82407078047224
                ],
                [
                    86.62109374999903,
                    49.09545216253633
                ],
                [
                    53.39843749999869,
                    49.09545216253633
                ]
            ]
    });
    map.addLayer(waterLayer);
}

</script>
<style lang="less" scoped>
.waterMap {
    height: 100%;
}
</style>