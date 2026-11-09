<script setup lang="ts">
withDefaults(defineProps<{ x: number; y: number; width: number; height: number; screenWidth?: number; screenHeight?: number }>(), { screenWidth: 320, screenHeight: 216 })
</script>
<template>
  <button class="pixel-hit" :style="{ left: `${x / screenWidth * 100}%`, top: `${y / screenHeight * 100}%`, width: `${width / screenWidth * 100}%`, height: `${height / screenHeight * 100}%` }"><span><slot /></span></button>
</template>
<style scoped>
.pixel-hit { position: absolute; padding: 0; border: 0; background: transparent; cursor: pointer; border-radius: 0; }
.pixel-hit:hover { background: #3827100d; }
.pixel-hit:active { background: #38271026; }
.pixel-hit:focus-visible { outline: 2px dashed #302719; outline-offset: 4px; }
span { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
</style>
