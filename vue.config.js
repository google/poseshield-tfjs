/**
 * @license
 * Copyright 2019 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
