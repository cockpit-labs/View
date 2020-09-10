import { shallowMount } from '@vue/test-utils'
import SAlert from '@/plugins/cockpit-ui/components/alert/SAlert'

describe('Alert', () => {
  const wrapper = shallowMount(SAlert, {
    slots: {
      title: 'Error 500',
      content: 'Cum haec taliaque sollicitas eius aures everberarent expositas semper eius modi rumoribu'
    },
    mocks: {
      $t: key => key
    }
  })

  it('should not be opened by default', () => {
    const alert = wrapper.find('.s-alert')
    expect(alert.exists()).toBe(false)
  })

  it('should have "type" prop equals to "alert"', () => {
    expect(wrapper.props('type')).toBe('alert')
  })

  it('can be open', async () => {
    // wrapper.vm.open()
    wrapper.setData({
      opened: true,
      dialogVisible: true
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.element).toMatchSnapshot()
  })

  it('can be close', async () => {
    wrapper.setData({
      opened: false
    })
    await wrapper.vm.$nextTick()
    const alert = wrapper.find('.s-alert')
    expect(alert.exists()).toBe(false)
    // const alert = wrapper.find('.s-alert')
    // expect(alert.exists()).toBe(false)
  })
  // it('should emit click event on click action button', async () => {
  //   const button = wrapper.find('sbutton-stub')
  //   const spy = jest.fn()
  //   wrapper.vm.$on('click', spy)
  //   button.vm.$emit('click')
  //   await wrapper.vm.$nextTick()
  //   expect(spy).toHaveBeenCalledTimes(1)
  // })
})
