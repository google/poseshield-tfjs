import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

/**
 * @return {messages} Messages/content from i18n file.
 */
function loadLocaleMessages() {
  // Uncomment to use json instead of YAML
  const locales = require.
      context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i);

  // Uncomment to using yaml file instead of json
  // const locales = require.
  // context('./locales', true, /[A-Za-z0-9-_,\s]+\.yaml$/i);
  const messages = {};

  locales.keys().forEach( (key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });

  return messages;
}

export default new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || 'en',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages: loadLocaleMessages(),
});
