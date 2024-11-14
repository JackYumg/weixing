<template>
    <canvas class="clip" id="clip"></canvas>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
    // 获取canvas元素
    const canvas: HTMLCanvasElement = document.getElementById('clip');
    const ctx: CanvasRenderingContext2D = canvas!.getContext('2d');

    // 加载背景图片
    const backgroundImage = new Image();
    backgroundImage.src = 'http://zhpc.bjwyebd.cn:8080/w_plat/profile/picture/20241101110000/Bj_Subjective1hour_20241101110000_20241102080000.png'; // 背景图片路径
    backgroundImage.onload = function () {
        canvas.width = backgroundImage.width;
        canvas.height = backgroundImage.height;
        // 加载前景图片
        const foregroundImage = new Image();
        foregroundImage.src = 'http://localhost:3042/src/assets/images/luoqu/luoquFuBei.png'; // 前景图片路径
        foregroundImage.onload = function () {
            // 在canvas上绘制背景图片
            ctx.drawImage(backgroundImage, 0, 0);

            // 将背景图片作为背景保存
            ctx.save();

            // 用黑色填充，确保前景图片的形状被用来裁剪
            ctx.fillStyle = '#ffffff00';
            ctx.fillRect(0, 0, '957', '864');

            // 将剪切区域设置为前景图片形状
            ctx.globalCompositeOperation = 'destination-out';
            ctx.drawImage(foregroundImage, 0, 0);

            // 取消剪切区域
            ctx.restore();
        };
    };
})
</script>
<style scoped lang="less">
.clip {
    width: 957px;
    height: 864px;
}
</style>