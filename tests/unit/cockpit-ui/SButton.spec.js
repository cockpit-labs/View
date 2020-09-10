import { shallowMount } from '@vue/test-utils'
import SButton from '@/plugins/cockpit-ui/components/button/SButton'

describe('Button', () => {
  const wrapper = shallowMount(SButton, {
    slots: {
      default: 'Hello world'
    }
  })

  it('should match snapshot', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  it('should contain label', () => {
    const button = wrapper.find('button')
    expect(button.text()).toBe('Hello world')
  })

  it('should emit an event click on click', () => {
    const button = wrapper.find('button')
    const spy = jest.fn()
    wrapper.vm.$on('click', spy)
    button.trigger('click')
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('can be rounded', async () => {
    wrapper.setProps({ rounded: true })
    await wrapper.vm.$nextTick()
    expect(wrapper.classes('rounded')).toBe(true)
  })

  it('can have an icon', async () => {
    const iconName = 'angle-right'
    wrapper.setProps({ icon: iconName })
    await wrapper.vm.$nextTick()
    const icon = wrapper.find('sicon-stub')
    expect(icon.attributes('name')).toBe(iconName)
  })

  it('can have ghost style', async () => {
    wrapper.setProps({ ghost: true })
    await wrapper.vm.$nextTick()
    expect(wrapper.classes('ghost')).toBe(true)
  })
})
