<template>
  <div id="app" class="s-font" :class="$mq">
    <router-view/>
    <SAlert ref="alert" type="error">
      <template #title>{{ $t('alert.errorTitle', {code: errorCode}) }}</template>
      <template #content>
        <div v-html="$t('alert.errorOccurred')"></div>
      </template>
      <template #actions>
        <SButton @click="reloadApp">{{ $t('alert.retry') }}</SButton>
      </template>
    </SAlert>
  </div>
</template>

<script>
import { http } from '@/plugins/http'
import { isEmpty } from 'lodash'

export default {
  data () {
    return {
      errorCode: null
    }
  },

  methods: {
    reloadApp () {
      document.location.reload(true)
    }
  },

  created () {
    http.interceptors.response.use(response => {
      if (isEmpty(response.data)) {
        response.data = []
      }
      return response
    }, error => {
      if (error.response) {
        this.errorCode = error.response.status
      }
      this.$refs.alert.open()
      return Promise.reject(error)
    })
  }
}
</script>

<style lang="scss">
html {
  height: 100%;
}

body {
  margin: 0;
  background-color: var(--color-n-050);
  overflow: hidden;
  height: 100%;
}

#app {
  height: 100%;
  width: 100vw;
  // display:flex;
  // flex-direction: column;
  box-sizing: border-box;
  // overflow: hidden;
}

// .page {
//   padding: 126px 16px 32px;
//   overflow: auto;
// }

.link {
  color: $color-n-600;
  text-decoration: none;
  font-size: 16px;
}

#app.desktop {
  .page {
    padding: 126px 62px 32px;
  }
}
</style>
