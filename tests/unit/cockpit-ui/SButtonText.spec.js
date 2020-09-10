import { shallowMount } from '@vue/test-utils'
import '@/plugins/fontawesome'
import SButtonText from '@/plugins/cockpit-ui/components/button/SButtonText'

describe('Button', () => {
  const wrapper = shallowMount(SButtonText, {
    propsData: {
      icon: 'times'
    },
    slots: {
      default: 'Hello world'
    }
  })

  it('should contain label', () => {
    const button = wrapper.find('button')
    expect(button.text()).toContain('Hello world')
  })

  it('should contain an icon', () => {
    const icon = wrapper.find('sicon-stub')
    expect(icon.attributes('name')).toBe('times')
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
})
