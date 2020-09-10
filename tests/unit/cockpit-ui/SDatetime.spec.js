import { shallowMount } from '@vue/test-utils'
import SDatetime from '@/plugins/cockpit-ui/components/datetime/SDatetime'

describe('Datetime', () => {
  const wrapper = shallowMount(SDatetime, {
    propsData: {
      value: '2020-01-01',
      placeholder: 'Set a date'
    },
    mocks: {
      $t: key => key
    }
  })

  it('should match snapshot', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  it('should contain a local value equal to value prop', () => {
    expect(wrapper.vm.localValue).toBe(wrapper.props().value)
  })

  it('should emit an input event after an update of the value', () => {
    const spy = jest.fn()
    wrapper.vm.$on('input', spy)
    wrapper.setData({ localValue: '2020-12-31' })
    wrapper.vm.commitValue()
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('can be reset', () => {
    const spy = jest.fn()
    wrapper.vm.$on('input', spy)
    wrapper.vm.reset()
    expect(wrapper.vm.localValue).toBeNull()
    expect(spy).toHaveBeenCalledTimes(1)
  })
})
