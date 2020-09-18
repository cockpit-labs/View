module.exports = {
  devServer: {
    proxy: {
      '^/core/api': {
        target: 'https://cockpitce.vagrant.cockpitlab.local',
        ws: true,
        changeOrigin: true
      },
      '^/data/lang/view': {
        target: 'http://localhost:8080',
        pathRewrite: { '^/data/lang/view': '/lang' }
      }
    }
  },
  css: {
    loaderOptions: {
      scss: {
        prependData: `
          @import "~@/plugins/cockpit-ui/scss/variables.scss";
          @import "~@/plugins/cockpit-ui/scss/mixins.scss";
        `
      }
    }
  }
}
