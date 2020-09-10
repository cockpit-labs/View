import { mount } from '@vue/test-utils'
import '@/plugins/fontawesome'
import SIcon from '@/plugins/cockpit-ui/components/icon/SIcon'

describe('Icon', () => {
  const wrapper = mount(SIcon, {
    propsData: {
      name: 'times'
    }
  })

  it('should match snapshot', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  it('should have "fw" prop equals to false', () => {
    expect(wrapper.props('fw')).toBeFalsy()
  })
})
