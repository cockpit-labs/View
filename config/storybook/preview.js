import { addParameters } from '@storybook/vue'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import '@fortawesome/fontawesome-free/js/all'
import '@/plugins/cockpit-ui/scss/cockpit-ui.scss'

addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS
  }
})
