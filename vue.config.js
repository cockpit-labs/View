module.exports = {
  devServer: {
    port: 3454,
    proxy: {
      '^/core/api': {
        target: 'http://localhost',
        ws: true,
        changeOrigin: true
      },
      '^/data/lang/view': {
        target: 'http://localhost:3454',
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
