import { mount } from '@vue/test-utils'
import '@/plugins/fontawesome'
import SButtonIcon from '@/plugins/cockpit-ui/components/button/SButtonIcon'
import SIcon from '@/plugins/cockpit-ui/components/icon/SIcon'

describe('Button', () => {
  const wrapper = mount(SButtonIcon, {
    propsData: {
      icon: 'times',
      label: 'Hello world'
    }
  })

  it('should not contain label', () => {
    const button = wrapper.find('button')
    expect(button.text()).not.toBe('Hello world')
  })

  it('should contain an icon', () => {
    const icon = wrapper.findComponent(SIcon)
    expect(icon.element.tagName).toBe('svg')
  })

  it('should emit an event click on click', () => {
    const button = wrapper.find('button')
    const spy = jest.fn()
    wrapper.vm.$on('click', spy)
    button.trigger('click')
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('should match snapshot', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  it('should have primary color by default', () => {
    expect(wrapper.props('color')).toBe('primary')
    expect(wrapper.classes('primary')).toBe(true)
  })

  it('can have a color named "inverted"', async () => {
    wrapper.setProps({ color: 'inverted' })
    await wrapper.vm.$nextTick()
    expect(wrapper.classes('inverted')).toBe(true)
  })

  it('can have a color named "neutral"', async () => {
    wrapper.setProps({ color: 'neutral' })
    await wrapper.vm.$nextTick()
    expect(wrapper.classes('neutral')).toBe(true)
  })
})
