import { shallowMount } from '@vue/test-utils'
import SListCard from '@/plugins/cockpit-ui/components/list-card/SListCard'

describe('List card', () => {
  const wrapper = shallowMount(SListCard, {
    slots: {
      title: 'Follow Up POS',
      body: 'Cum haec taliaque sollicitas eius aures everberarent expositas semper eius modi rumoribu',
      footer: '4 days left',
      'action-label': 'Start'
    }
  })

  it('should match snapshot', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  it('should emit click event on click action button', async () => {
    const button = wrapper.find('sbutton-stub')
    const spy = jest.fn()
    wrapper.vm.$on('click', spy)
    button.vm.$emit('click')
    await wrapper.vm.$nextTick()
    expect(spy).toHaveBeenCalledTimes(1)
  })
})
