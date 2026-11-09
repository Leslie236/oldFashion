<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import PixelScreen from '../components/pixel/PixelScreen.vue'
import PixelButton from '../components/pixel/PixelButton.vue'
import { frame, text } from '../components/pixel/draw'

const palette = ref<'amber' | 'sage' | 'silver'>('amber')
const gap = ref(0.24)
const contrast = ref(0.86)
const inactive = ref(true)
const running = ref(false)
const sound = ref(true)
const progress = ref(64)
const ticks = ref(0)
const message = ref('READY TO EXPLORE')
const sample = ref('你好，像素世界')
const revision = computed(() => [running.value, sound.value, progress.value, ticks.value, message.value, sample.value].join('|'))
const timer = window.setInterval(() => {
  if (running.value) {
    ticks.value++
    progress.value = (progress.value + 1) % 101
  }
}, 300)
onBeforeUnmount(() => window.clearInterval(timer))
function toggleRun() { running.value = !running.value; message.value = running.value ? 'EXPERIMENT RUNNING' : 'EXPERIMENT PAUSED' }
function reset() { running.value = false; progress.value = 64; ticks.value = 0; message.value = 'READY TO EXPLORE' }
function render(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#000'
  text(ctx, 'DOT / OS', 12, 11)
  text(ctx, 'LAB 001', 258, 11)
  ctx.fillRect(12, 25, 296, 1)
  text(ctx, sample.value, 12, 37)
  text(ctx, `${String(Math.floor(ticks.value / 60)).padStart(2, '0')}:${String(ticks.value % 60).padStart(2, '0')}`, 12, 65, 4)
  text(ctx, 'PIXEL', 171, 68)
  text(ctx, 'PLAYGROUND', 171, 80)
  text(ctx, '320 X 216', 171, 99)
  ctx.fillRect(12, 113, 296, 1)
  text(ctx, 'SIGNAL', 12, 124)
  for (let i = 0; i < 20; i++) {
    const h = Math.round(5 + (Math.sin(i * 0.7 + ticks.value * 0.3) + 1) * 11)
    ctx.fillRect(12 + i * 5, 167 - h, 3, h)
  }
  text(ctx, 'LEVEL', 133, 124)
  text(ctx, `${progress.value}%`, 248, 124)
  frame(ctx, 133, 139, 175, 10)
  for (let i = 0; i < Math.round(progress.value / 100 * 34); i++) ctx.fillRect(136 + i * 5, 142, 3, 4)
  text(ctx, 'SOUND', 133, 160)
  frame(ctx, 274, 157, 34, 13)
  ctx.fillRect(sound.value ? 294 : 277, 160, 11, 7)
  frame(ctx, 12, 181, 94, 22)
  text(ctx, running.value ? 'PAUSE' : 'START', 44, 188)
  frame(ctx, 113, 181, 64, 22)
  text(ctx, 'RESET', 130, 188)
  text(ctx, running.value ? 'LIVE' : 'IDLE', 280, 190)
  ctx.fillRect(269, 191, 4, 4)
}
</script>

<template>
  <main class="lab">
    <header class="masthead">
      <a class="wordmark" href="/PixelTest"><span class="brand-grid">▦</span> oldfashion<span class="wordmark-dot">®</span></a>
      <span class="masthead-meta">INTERFACE EXPERIMENTS <span class="separator">/</span> VOL. 001</span>
      <span class="lab-status"><i /> LOCAL LAB</span>
    </header>
    <section class="intro">
      <div><p class="eyebrow">THE DISPLAY SERIES — 01</p><h1>Small pixels.<br /><span>Physical presence.</span></h1></div>
      <div class="intro-aside"><span class="tag">PixelTest / 交互原型</span><p>从一个像素开始。<br />让文字、组件与交互，发生在同一块屏幕上。</p></div>
    </section>
    <div class="workspace">
      <section class="preview-panel" aria-label="点阵屏幕预览">
        <div class="panel-heading"><span>01 / LIVE DISPLAY</span><span class="live-label"><i /> {{ running ? 'RUNNING' : 'STANDBY' }}</span></div>
        <div class="device-stage">
          <div class="device">
            <div class="device-top"><span>DOT MATRIX DISPLAY</span><span>OF—320</span></div>
            <div class="bezel">
              <PixelScreen :gap="gap" :contrast="contrast" :inactive="inactive" :palette="palette" :render="render" :revision="revision">
                <PixelButton :x="12" :y="181" :width="94" :height="22" :aria-pressed="running" @click="toggleRun">{{ running ? '暂停' : '开始' }}</PixelButton>
                <PixelButton :x="113" :y="181" :width="64" :height="22" @click="reset">重置</PixelButton>
                <PixelButton :x="266" :y="153" :width="45" :height="21" role="switch" :aria-checked="sound" @click="sound = !sound">声音</PixelButton>
              </PixelScreen>
            </div>
            <div class="device-bottom"><span><i /> {{ message }}</span><span>LOW RES. / HIGH FEEL.</span></div>
          </div>
        </div>
        <footer class="preview-footer"><span>点击屏幕内的 START、RESET 和开关试试</span><span>CANVAS 2D <b>·</b> 320 × 216</span></footer>
      </section>
      <aside class="settings" aria-label="屏幕设置">
        <div class="settings-heading"><h2>Screen settings</h2><span>实时调校</span></div>
        <div class="setting-group"><label class="field-label">01 <span>显示材质</span></label>
          <div class="palette-options">
            <button v-for="option in (['amber', 'sage', 'silver'] as const)" :key="option" :class="['palette-option', option, { selected: palette === option }]" :aria-pressed="palette === option" @click="palette = option"><i /><span>{{ { amber: '琥珀', sage: '鼠尾草', silver: '银灰' }[option] }}</span></button>
          </div>
        </div>
        <div class="setting-group"><label class="field-label" for="gap">02 <span>像素间隙</span><output>{{ Math.round(gap * 100) }}%</output></label><input id="gap" v-model.number="gap" type="range" min="0" max="0.65" step="0.01" /><div class="range-labels"><span>连续像素</span><span>独立单元</span></div></div>
        <div class="setting-group"><label class="field-label" for="contrast">03 <span>显示对比度</span><output>{{ Math.round(contrast * 100) }}%</output></label><input id="contrast" v-model.number="contrast" type="range" min="0.2" max="1" step="0.01" /></div>
        <div class="setting-group"><label class="field-label" for="sample">04 <span>文字试验</span></label><input id="sample" v-model="sample" class="text-input" maxlength="17" placeholder="输入中文或英文" /><p class="field-hint">中英文都经过同一层点阵渲染</p></div>
        <div class="setting-group"><label class="field-label" for="level">05 <span>进度条</span><output>{{ progress }}%</output></label><input id="level" v-model.number="progress" type="range" min="0" max="100" /></div>
        <label class="inactive-row"><span>显示未激活像素<small>保留屏幕的物理网格</small></span><input v-model="inactive" type="checkbox" class="toggle" /></label>
        <div class="settings-note"><span>↳</span><p>界面在低分辨率中绘制，<br />像素的形状与间距在显示层定义。</p></div>
      </aside>
    </div>
    <section class="spec-strip"><div><span>01 / STRUCTURE</span><p>统一逻辑网格</p></div><div><span>02 / TYPE</span><p>位图英文 · 栅格化中文</p></div><div><span>03 / INTERACTION</span><p>原生焦点与键盘操作</p></div><div><span>04 / MATERIAL</span><p>可调间距 · 低对比液晶</p></div></section>
    <footer class="page-footer"><span>OLDFASHION — AN ONGOING EXPERIMENT</span><span>用今天的技术，找回像素的触感。</span></footer>
  </main>
</template>

<style>
:root { font-family: 'DM Sans', 'PingFang SC', sans-serif; color: #282921; background: #f3f2ec; font-synthesis: none; }
* { box-sizing: border-box; }
body { margin: 0; }
button, input { font: inherit; }
button, a, input { -webkit-tap-highlight-color: transparent; }
button:focus-visible, a:focus-visible, input:focus-visible { outline: 2px solid #846b44; outline-offset: 4px; }
.lab { max-width: 1500px; padding: 0 5%; margin: auto; }
.masthead { min-height: 90px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #d8d9cf; gap: 20px; }
.wordmark { color: inherit; text-decoration: none; font-size: 25px; font-weight: 700; letter-spacing: -1px; display: flex; align-items: center; gap: 10px; }
.brand-grid { color: #6f7658; font-size: 31px; }.wordmark-dot { font-size: 12px; align-self: start; margin: 5px 0 0 -5px; }
.masthead-meta, .lab-status, .eyebrow, .panel-heading, .device-top, .device-bottom, .preview-footer, .spec-strip span, .page-footer { font-family: 'SFMono-Regular', Consolas, monospace; font-size: 10px; letter-spacing: 1px; }
.masthead-meta { color: #86887a; }.separator { padding: 0 14px; color: #b6b7ac; }.lab-status { display: flex; gap: 8px; align-items: center; }
.lab-status i, .live-label i { width: 6px; height: 6px; border-radius: 50%; background: #7b8564; display: inline-block; }
.intro { display: flex; align-items: end; justify-content: space-between; padding: 49px 0 38px; gap: 24px; }.eyebrow { color: #858976; margin: 0 0 18px; }
h1 { font-family: 'Space Grotesk', sans-serif; font-weight: 500; font-size: clamp(38px, 4.1vw, 60px); line-height: 1.08; letter-spacing: -2.8px; margin: 0; }h1 span { color: #858a74; }
.intro-aside { padding-bottom: 2px; }.tag { border: 1px solid #d5d7c9; font-size: 10px; padding: 6px 10px; border-radius: 3px; }.intro-aside p { font-size: 12px; color: #7b7e71; line-height: 1.9; margin-bottom: 0; }
.workspace { display: grid; grid-template-columns: minmax(0, 1fr) 286px; border: 1px solid #d6d7cd; border-radius: 5px; overflow: hidden; background: #f8f7f2; }
.preview-panel { min-width: 0; display: flex; flex-direction: column; }.panel-heading { height: 53px; display: flex; align-items: center; justify-content: space-between; padding: 0 25px; color: #7d8072; border-bottom: 1px solid #dedfd5; }.live-label { display: flex; gap: 7px; align-items: center; font-size: 9px; }
.device-stage { flex: 1; display: grid; place-items: center; padding: 43px 36px; background-color: #e9e9df; background-image: radial-gradient(#bfc3b35c .7px, transparent .7px); background-size: 6px 6px; }
.device { width: 100%; max-width: 760px; padding: 19px 22px 16px; background: linear-gradient(145deg, #494b40, #35382e); border-radius: 11px; border: 1px solid #56594b; box-shadow: 0 18px 25px -15px #22271d66, 0 3px 3px #25291c33, inset 0 1px 0 #ffffff30; }
.device-top { display: flex; justify-content: space-between; color: #bdc0a9; font-size: 8px; margin-bottom: 14px; letter-spacing: 1.5px; }.bezel { background: #292b23; padding: 7px; border-radius: 5px; box-shadow: 0 1px 0 #ffffff21, inset 0 2px 5px #0008; }.device-bottom { display: flex; justify-content: space-between; gap: 8px; color: #9ca18c; font-size: 7px; margin-top: 15px; letter-spacing: .6px; }.device-bottom i { display: inline-block; width: 4px; height: 4px; border-radius: 50%; background: #b4bd8b; margin-right: 5px; box-shadow: 0 0 5px #b4bd8b44; }
.preview-footer { padding: 18px 24px; display: flex; justify-content: space-between; gap: 12px; color: #898b7d; font-size: 9px; letter-spacing: .3px; }.preview-footer b { margin: 0 7px; font-weight: 400; }
.settings { border-left: 1px solid #d6d7cd; padding: 24px; }.settings-heading { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }.settings-heading h2 { font-size: 15px; font-weight: 500; margin: 0; letter-spacing: -.4px; }.settings-heading > span { font-size: 10px; color: #959785; }
.setting-group { margin-bottom: 25px; }.field-label { display: flex; gap: 10px; font-size: 10px; color: #a1a58e; margin-bottom: 12px; }.field-label > span { color: #555b49; font-size: 11px; }.field-label output { margin-left: auto; color: #6e755d; font-family: monospace; }
.palette-options { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; }.palette-option { border: 1px solid #dcdfd1; border-radius: 3px; background: transparent; cursor: pointer; padding: 8px 5px 6px; font-size: 10px; color: #7c826e; }.palette-option i { display: block; height: 21px; margin-bottom: 7px; border-radius: 2px; background: #ba713d; box-shadow: inset 0 1px 3px #0002; }.palette-option.sage i { background: #a6ad7b; }.palette-option.silver i { background: #b7bcb4; }.palette-option.selected { border-color: #7e8569; background: #e9ecdf; color: #3c4530; }
input[type=range] { width: 100%; display: block; height: 4px; margin: 15px 0; appearance: none; background: #dedfd4; border-radius: 4px; accent-color: #737b5a; cursor: pointer; }input[type=range]::-webkit-slider-thumb { appearance: none; width: 12px; height: 12px; border-radius: 50%; background: #737b5a; border: 2px solid #f8f7f2; box-shadow: 0 0 0 1px #737b5a; }input[type=range]::-moz-range-thumb { width: 10px; height: 10px; border: 1px solid #f8f7f2; background: #737b5a; border-radius: 50%; }.range-labels { display: flex; justify-content: space-between; font-size: 9px; color: #9a9f8c; }.text-input { width: 100%; border: 1px solid #d8dccd; border-radius: 3px; padding: 9px 10px; font-size: 12px; color: #515940; background: #f2f3eb; }.field-hint { font-size: 9px; color: #9a9e8e; margin: 7px 0 0; }
.inactive-row { display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: #555b49; padding-top: 17px; border-top: 1px solid #e2e4d8; }.inactive-row small { display: block; color: #9a9f8c; font-size: 9px; margin-top: 6px; }.toggle { appearance: none; width: 29px; height: 16px; border-radius: 10px; background: #ced2c3; position: relative; cursor: pointer; flex-shrink: 0; }.toggle::after { content: ''; position: absolute; width: 10px; height: 10px; background: #fff; border-radius: 50%; left: 3px; top: 3px; transition: transform .15s; }.toggle:checked { background: #7c8562; }.toggle:checked::after { transform: translateX(13px); }.settings-note { display: flex; align-items: start; gap: 10px; font-size: 10px; color: #8c927c; background: #eceee3; border-radius: 3px; padding: 12px; margin-top: 24px; }.settings-note p { margin: 0; line-height: 1.8; }.settings-note > span { font-size: 16px; }
.spec-strip { display: grid; grid-template-columns: repeat(4, 1fr); padding: 27px 0; border-bottom: 1px solid #d8d9cf; }.spec-strip div { border-left: 1px solid #d8d9cf; padding-left: 24px; }.spec-strip div:first-child { padding-left: 0; border: 0; }.spec-strip span { color: #949987; font-size: 9px; }.spec-strip p { font-size: 11px; color: #606753; margin: 10px 0 0; }.page-footer { display: flex; justify-content: space-between; padding: 23px 0; font-size: 8px; color: #9a9e8d; letter-spacing: .6px; }
@media (min-width: 1450px) { .device-stage { padding: 48px; } }
@media (max-width: 1000px) { .lab { padding: 0 4%; }.workspace { grid-template-columns: minmax(0, 1fr) 250px; }.settings { padding: 20px; }.device-stage { padding: 30px 18px; }.device { padding: 16px 14px 13px; }.preview-footer { flex-direction: column; }.masthead-meta { display: none; }.intro-aside p { font-size: 11px; } }
@media (max-width: 720px) { .masthead { min-height: 72px; }.intro { padding: 32px 0; align-items: start; flex-direction: column; gap: 22px; }h1 { font-size: 43px; }.intro-aside { display: flex; align-items: center; gap: 16px; }.intro-aside p { margin: 0; font-size: 10px; }.workspace { grid-template-columns: 1fr; }.settings { border-left: 0; border-top: 1px solid #d6d7cd; }.device-stage { padding: 32px 15px; }.device { padding: 14px 11px 12px; }.device-top { font-size: 7px; }.device-bottom { font-size: 6px; }.preview-footer { flex-direction: row; font-size: 8px; padding: 15px; }.settings-heading { margin-bottom: 25px; }.spec-strip { grid-template-columns: 1fr 1fr; gap: 24px 12px; }.spec-strip div:nth-child(3) { padding-left: 0; border: 0; }.page-footer { gap: 15px; font-size: 7px; }.page-footer span:last-child { text-align: right; } }
</style>
