import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PixelTest from '../views/PixelTest.vue'

const options = { global: { stubs: { PixelScreen: { template: '<div><slot /></div>' } } } }
afterEach(() => vi.useRealTimers())
describe('PixelTest', () => {
  it('starts, pauses and resets the screen simulation', async () => {
    vi.useFakeTimers()
    const wrapper = mount(PixelTest, options)
    const start = wrapper.get('button[aria-pressed="false"].pixel-hit')
    await start.trigger('click')
    expect(start.attributes('aria-pressed')).toBe('true')
    await vi.advanceTimersByTimeAsync(900)
    expect((wrapper.get('#level').element as HTMLInputElement).value).toBe('67')
    await start.trigger('click')
    await vi.advanceTimersByTimeAsync(900)
    expect((wrapper.get('#level').element as HTMLInputElement).value).toBe('67')
    await wrapper.findAll('.pixel-hit')[1]!.trigger('click')
    expect((wrapper.get('#level').element as HTMLInputElement).value).toBe('64')
    expect(wrapper.text()).toContain('READY TO EXPLORE')
    wrapper.unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
  it('toggles the screen switch and edits display controls', async () => {
    const wrapper = mount(PixelTest, options)
    const sound = wrapper.get('[role="switch"]')
    await sound.trigger('click')
    expect(sound.attributes('aria-checked')).toBe('false')
    await wrapper.get('#gap').setValue('0.5')
    expect(wrapper.text()).toContain('50%')
    await wrapper.get('.sage').trigger('click')
    expect(wrapper.get('.sage').attributes('aria-pressed')).toBe('true')
    wrapper.unmount()
  })
})
