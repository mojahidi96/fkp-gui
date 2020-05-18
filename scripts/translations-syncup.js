const BUNDLES = require('./bundles');
const bundleUtils = require('./bundle-utils');
const databaseUtils = require('./database-utils');

Object.keys(BUNDLES).forEach(bundleName => {
  bundleUtils.availableLocales.forEach(locale => {
    checkAndReplace(bundleName, locale)
  });
});

function checkAndReplace(bundleName, locale) {
  databaseUtils.getRowsByBundleAndLocale(BUNDLES[bundleName], locale)
    .then(result => {
      if (result.rows.length) {
        const rows = databaseUtils.parseResults(result.rows);
        let keys;
        try {
          keys = bundleUtils.getBundle(bundleName, locale)
        } catch (e) {
        }

        const shouldOverride = !keys || Object.keys(rows).some(rowKey => {
          const keyText = keys[rowKey];
          return !keyText || rows[rowKey] !== keyText;
        });

        if (shouldOverride) {
          const content = 'module.exports = ' + JSON.stringify(rows, Object.keys(rows).sort(), 2) + ';';
          bundleUtils.writeBundle(bundleName, content, locale);
          console.log(bundleName, locale, '- replaced successfully!');
        } else {
          console.log(bundleName, locale, '- nothing to replace');
        }
      }
    });
}

