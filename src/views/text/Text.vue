<template>
    <canvas id="text" width="1920" height="1080"></canvas>
</template>
<style lang="less" scoped>
#text {
    width: 1920px;
    height: 1080px;
}
</style>
<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
    // 获取Canvas元素
    const canvas: HTMLCanvasElement = document.getElementById('text') as HTMLCanvasElement;
    // 创建context对象
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
    const text = '2024年11月08日14时-09日08时';
    const textW = ctx.measureText(text);
    // 添加线性渐变
    const gradient = ctx.createLinearGradient(0, 0, 600, 400);
    gradient.addColorStop(0, 'red');
    gradient.addColorStop(1, 'blue');
    ctx.fillStyle = gradient;
    console.log(textW);
    // 设置字体样式
    ctx.font = '12px Arial';
    // 设置填充颜色
    // 绘制文本
    ctx.textAlign = 'center'
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fillText(text, 50, 50);
});
</script>