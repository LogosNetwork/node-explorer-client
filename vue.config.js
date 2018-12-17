const CompressionPlugin = require('compression-webpack-plugin')

module.exports = {
  configureWebpack: {
    devtool: 'source-map',
    plugins: [
      new CompressionPlugin()
    ]
  },
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  }
}
