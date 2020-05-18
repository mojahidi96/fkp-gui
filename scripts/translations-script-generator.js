const fs = require('fs');
const util = require('util');
const BUNDLES = require('./bundles');
const bundleUtils = require('./bundle-utils');
const databaseUtils = require('./database-utils');

const bundleName = process.argv[2];
const defaultLocale = '_de_DE';

if (!bundleName) {
  console.error('ERROR: Provide a bundle name');

  return;
} else if (!BUNDLES[bundleName]) {
  console.error('ERROR: Invalid bundle name');
  return;
}

const DB_BUNDLE = BUNDLES[bundleName];
const INSERT_STATEMENT = 'Insert into SNCR_DRB_BUNDLE (BUNDLE,KEY,VALUE,LAST_MODIFIED_TS,USER_ID,LOCALE) values (\'%s\',\'%s\',\'%s\',systimestamp,null,\'%s\');\n';

bundleUtils.availableLocales.forEach(locale => createScript(locale));

function createScript(locale) {
  const currentBundle = bundleUtils.getBundle(bundleName, locale);

  databaseUtils.getRowsByBundleAndLocale(DB_BUNDLE, locale)
    .then(result => {
      if (result.rows.length > 0) {
        updateBundle(result.rows, currentBundle, locale);
      } else {
        createNewBundle(currentBundle, locale);
      }
    });
}

function createNewBundle(currentBundle, locale) {
  const DELETE_STATEMENT = 'delete from SNCR_DRB_BUNDLE where bundle=\'%s\' and locale in (%s);\n\n';

  const locales = locale === defaultLocale ? `'${locale}','_'` : `'${locale}'`;
  const sql = util.format(DELETE_STATEMENT, DB_BUNDLE, locales) + generateInserts(Object.keys(currentBundle), currentBundle, locale);

  writeSqlScript(sql, locale, () => console.log('New bundle script created successfully!'));
}

function updateBundle(result, currentBundle, locale) {
  const DELETE_STATEMENT = 'delete from SNCR_DRB_BUNDLE where bundle=\'%s\' and key in (%s) and locale in (%s);\n\n';

  const parsedResults = databaseUtils.parseResults(result);

  let toDelete = [];
  let toUpdate = [];
  Object.keys(parsedResults).forEach(key => {
    if (!currentBundle[key]) {
      toDelete.push(key);
    }
  });

  Object.keys(currentBundle).forEach(key => {
    const currentInDB = parsedResults[key];
    if (!currentInDB || currentInDB !== currentBundle[key]) {
      toUpdate.push(key);
    }
  });

  if (!toDelete.length && !toUpdate.length) {
    console.log('Nothing to update');
  } else {
    if (toDelete.length) {
      console.warn('WARNING: The following keys will be deleted from DB:\n-', toDelete.join('\n- '));
    }
    const keysToDelete = [...toDelete, ...toUpdate].map(k => `'${k}'`).join(',');
    const locales = locale === defaultLocale ? `'${locale}','_'` : `'${locale}'`;
    const sql = util.format(DELETE_STATEMENT, DB_BUNDLE, keysToDelete, locales) + generateInserts(toUpdate, currentBundle, locale);

    writeSqlScript(sql, locale, () => console.log('Update bundle script created successfully!'));
  }
}

function generateInserts(keys, currentBundle, locale) {
  let sql = '';

  keys.forEach(key => {
    const insert = util.format(INSERT_STATEMENT, DB_BUNDLE, key, currentBundle[key]);
    sql += util.format(insert, locale);
    if (locale === defaultLocale) {
      sql += util.format(insert, '_');
    }
  });

  return sql;
}

function writeSqlScript(sql, locale, success) {
  fs.writeFile(`${bundleName.replace('/', '_')}-${locale}.sql`, sql, err => {
    if (err) {
      console.error('ERROR:', err);
      return;
    }

    success && success();
  });
}