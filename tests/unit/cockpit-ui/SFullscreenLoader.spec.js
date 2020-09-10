import { mount } from '@vue/test-utils'
import '@/plugins/fontawesome'
import SFullscreenLoader from '@/plugins/cockpit-ui/components/fullscreen-loader/SFullscreenLoader'
import SIcon from '@/plugins/cockpit-ui/components/icon/SIcon'

describe('Fullscreen loader', () => {
  const wrapper = mount(SFullscreenLoader, {
    slots: {
      default: 'Loading...'
    }
  })

  it('should contain default slot text', () => {
    expect(wrapper.find('.text').text()).toBe('Loading...')
  })

  it('should contain a spinner', () => {
    const icon = wrapper.findComponent(SIcon)
    expect(icon.props().spin).toBeTruthy()
  })

  it('should match snapshot', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
