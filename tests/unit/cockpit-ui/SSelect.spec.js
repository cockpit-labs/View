import { shallowMount } from '@vue/test-utils'
import SSelect from '@/plugins/cockpit-ui/components/select/SSelect'

describe('Select', () => {
  const wrapper = shallowMount(SSelect, {
    propsData: {
      value: ['1'],
      options: [
        { id: '1', label: 'Choice 1' },
        { id: '2', label: 'Choice 2' },
        { id: '3', label: 'Choice 3' }
      ],
      placeholder: 'Set a date'
    }
  })

  it('should match snapshot', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  it('should be closed by default', () => {
    const options = wrapper.find('.options')
    expect(options.exists()).toBeFalsy()
    expect(wrapper.vm.opened).toBeFalsy()
  })

  it('can be opened', async () => {
    wrapper.vm.open()
    await wrapper.vm.$nextTick()
    const options = wrapper.find('.options')
    expect(options.exists()).toBeTruthy()
  })

  it('should emit an input event after an update of the value', () => {
    const spy = jest.fn()
    wrapper.vm.$on('input', spy)
    wrapper.vm.selectOption('2')
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('can be reset', () => {
    const spy = jest.fn()
    wrapper.vm.$on('input', spy)
    wrapper.vm.reset()
    expect(spy).toHaveBeenCalledTimes(1)
  })
})
