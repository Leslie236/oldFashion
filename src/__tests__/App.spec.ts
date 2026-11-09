import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PixelButton from '../components/pixel/PixelButton.vue'

describe('PixelButton', () => {
  it('maps logical coordinates to screen hit targets and emits native clicks', async () => {
    const wrapper = mount(PixelButton, {
      props: { x: 32, y: 54, width: 80, height: 27 },
      slots: { default: '开始' },
    })
    expect(wrapper.attributes('style')).toContain('left: 10%')
    expect(wrapper.attributes('style')).toContain('top: 25%')
    expect(wrapper.attributes('style')).toContain('width: 25%')
    expect(wrapper.text()).toBe('开始')
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})
