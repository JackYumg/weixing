<template>
    <div id="seed" :style="containerSize">
        <template v-for="(item, index) in grids" :key="index">
            <span class="grid"
                v-bind:class="{ 'isSource': item.isSource, 'isFlood': item.isFlood, ['level-' + item.level]: true }"
                v-for="item in grids[index]" :key="item.id"
                :style="{ height: gridSize + 'px', width: gridSize + 'px', lineHeight: gridSize + 'px' }">
            </span>
        </template>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { createDemData, Seed, seedFlood } from './seed';

const grids = ref<Seed[][]>([]);
const gridSize = ref(10);
const containerSize = reactive({
    width: `1000px`,
    height: `800px`,
})
onMounted(() => {
    grids.value = createDemData(1000, 800, gridSize.value);
    const xSize = 1000 / gridSize.value;
    const ySize = 800 / gridSize.value;
    // 随机生成一个点
    const randomX = Math.floor(Math.random() * (xSize - 1)) + 1;
    const randomY = Math.floor(Math.random() * (ySize - 1)) + 1;
    const sourcePoint = grids.value[randomX][randomY];
    if (sourcePoint) {
        sourcePoint.isSource = true;
        sourcePoint.scanner = true;
        const res = seedFlood(sourcePoint, grids.value);
        console.log(res);

    }
});
</script>
<style lang="less" scoped>
#seed {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    display: flex;
    flex-wrap: wrap;
    gap: 0;
    align-content: flex-start;

    .grid {
        background-color: rgb(228, 228, 228);
        display: inline-block;
        box-sizing: border-box;
        //border: 1px solid #c9c9c9;
        font-size: 12px;
        text-align: center;

        &.isFlood {
            background-color: rgb(62, 144, 250) !important;
            color: #ffffff;
        }

        &.isSource {
            background-color: rgb(0, 49, 155) !important;
            color: #ffffff;
        }

        &.level-1 {
            background-color: rgb(132, 155, 0);
            color: #ffffff;
        }

        &.level-2 {
            background-color: rgb(13, 155, 0);
            color: #ffffff;
        }

        &.level-3 {
            background-color: rgb(0, 155, 39);
            color: #ffffff;
        }

        &.level-4 {
            background-color: rgb(0, 155, 52);
            color: #ffffff;
        }

        &.level-5 {
            background-color: rgb(0, 97, 29);
            color: #ffffff;
        }

        &.levle-6 {
            background-color: rgb(0, 49, 155);
        }
    }
}
</style>