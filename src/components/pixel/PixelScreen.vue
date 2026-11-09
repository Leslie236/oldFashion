<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  width?: number
  height?: number
  gap?: number
  contrast?: number
  inactive?: boolean
  palette?: 'amber' | 'sage' | 'silver'
  render: (context: CanvasRenderingContext2D) => void
  revision?: unknown
}>(), { width: 320, height: 216, gap: 0.22, contrast: 0.85, inactive: true, palette: 'amber' })
const canvas = ref<HTMLCanvasElement>()
const palettes = {
  amber: ['#bb703b', '#482a18'],
  sage: ['#a6ad7b', '#303c29'],
  silver: ['#b7bcb4', '#333e3b'],
} as const
let observer: ResizeObserver | undefined
function paint() {
  const target = canvas.value
  if (!target) return
  const buffer = document.createElement('canvas')
  buffer.width = props.width
  buffer.height = props.height
  const source = buffer.getContext('2d', { willReadFrequently: true })!
  props.render(source)
  const pixels = source.getImageData(0, 0, props.width, props.height).data
  const dpr = window.devicePixelRatio || 1
  target.width = Math.round(target.clientWidth * dpr)
  target.height = Math.round(target.clientHeight * dpr)
  const ctx = target.getContext('2d')!
  const [base, ink] = palettes[props.palette]
  ctx.fillStyle = base
  ctx.fillRect(0, 0, target.width, target.height)
  const sx = target.width / props.width
  const sy = target.height / props.height
  ctx.fillStyle = ink
  for (let y = 0; y < props.height; y++) {
    for (let x = 0; x < props.width; x++) {
      const active = pixels[(y * props.width + x) * 4 + 3]! > 110
      if (!active && !props.inactive) continue
      ctx.globalAlpha = active ? props.contrast : 0.055
      ctx.fillRect((x + props.gap / 2) * sx, (y + props.gap / 2) * sy, sx * (1 - props.gap), sy * (1 - props.gap))
    }
  }
  ctx.globalAlpha = 1
  const light = ctx.createLinearGradient(0, 0, target.width, target.height)
  light.addColorStop(0, 'rgba(255,232,184,.07)')
  light.addColorStop(0.55, 'rgba(255,232,184,0)')
  light.addColorStop(1, 'rgba(27,18,10,.12)')
  ctx.fillStyle = light
  ctx.fillRect(0, 0, target.width, target.height)
}
watch(() => [props.gap, props.contrast, props.inactive, props.palette, props.revision, props.width, props.height], paint, { flush: 'post' })
onMounted(() => {
  observer = new ResizeObserver(paint)
  observer.observe(canvas.value!)
  paint()
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div class="pixel-screen" :style="{ aspectRatio: `${width} / ${height}` }">
    <canvas ref="canvas" aria-hidden="true" />
    <div class="pixel-screen__interaction"><slot /></div>
  </div>
</template>

<style scoped>
.pixel-screen { position: relative; width: 100%; overflow: hidden; border-radius: 3px; box-shadow: inset 0 0 15px #0006; }
canvas { display: block; width: 100%; height: 100%; }
.pixel-screen::after { content: ''; position: absolute; inset: 0; pointer-events: none; box-shadow: inset 0 2px 12px #28160660; border: 1px solid #0003; border-radius: inherit; }
.pixel-screen__interaction { position: absolute; inset: 0; }
</style>
