module.exports = {
  publicPath: '/play/',
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/scss/global.scss";`,
      },
    },
  },
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false,
    },
  },

  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg');

    svgRule.uses.clear();

    svgRule.use('vue-svg-loader')
      .loader('vue-svg-loader');
      // Note that it's possible to modify the svg compression settings as
      // shown below; available options can be found here:
      // https://github.com/svg/svgo
      // .options({
      //     svgo: {
      //       plugins: [
      //         { removeStyleElement: true },
      //         { removeUselessDefs: false },
      //         { prefixIds: true },
      //         { inlineStyles: false },
      //         { convertStyleToAttrs: true },
      //       ],
      //     },
      //   });
  },
};
