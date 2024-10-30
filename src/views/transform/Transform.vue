<template>
    <div id="transform" class="transform"></div>
</template>
<script setup lang="ts">
import proj4 from 'proj4';
import { onMounted, ref } from 'vue';
import { convertCN2000ToWGS84, initMap, } from './transform';
import mapboxgl, { Map } from 'mapbox-gl';

const mapD = ref<mapboxgl.Map | null>(null);
onMounted(async () => {
    console.log(proj4);
    const map = initMap();

    mapD.value = map;
    map.on('style.load', () => {
        getSource(map).then((res) => {
            console.log(res);

            /** 将对象下载为json文件 */
            const points = res.map((item: any) => {
                return [item.lon, item.lat]
            })
            map.addSource('test', {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    geometry: {
                        type: 'Polygon',
                        coordinates: [
                            [
                                ...points
                            ]
                        ]
                    }
                }
            })

            map.addLayer({
                id: 'test',
                type: 'fill',
                source: 'test',
                paint: {
                    'fill-color': 'red',
                    'fill-opacity': 1
                },
                layout: {
                    visibility: 'visible'
                }
            })

            map.flyTo({
                center: [points[0][0], points[0][1]],
                zoom: 10,
                speed: 0.8,
                curve: 1
            })
        })
    })

});

const getSource = (mapData: Map) => {
    return new Promise((resolve) => {
        fetch('text/ElevationPoint.txt',).then((res) => {
            res.text().then((text) => {
                const result = [];
                const arr = text.replace('\r', '').split('\n');
                arr.map((subText) => {
                    const obj = {};
                    const subArr = subText.split(',').filter(e => !!e);
                    const [id, lon, lat, elev] = subArr;
                    if (!id || !lon || !lat) {
                        return;
                    }
                    const d = mapData.unproject([lat, lon]);

                    const temp = convertCN2000ToWGS84(d.lng, d.lat)

                    Object.assign(obj, {
                        id,
                        lon: temp.lon,
                        lat: temp.lat,
                        elev: elev.replace('\r', ''),
                    }
                    )
                    result.push(obj);
                });
                resolve(result);
            });
        });
    })
}

</script>
<style lang="less" scoped>
.transform {
    height: 100%;
    width: 100%;
}
</style>