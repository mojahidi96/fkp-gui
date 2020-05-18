const path = require('path');
const fs = require('fs');

const BASE_DIR = 'mocked-db/responses/localize';
const LOCALE_FILES = {
  '_de_DE': 'de-DE.js',
  '_en_US': 'en-US.js'
};

const availableLocales = ['_de_DE', '_en_US'];

function getBundle(bundleName, locale) {
  return require(getFilePath(bundleName, locale));
}

function writeBundle(bundleName, content, locale) {
  fs.writeFile(getFilePath(bundleName, locale), content, err => {
    if (err) {
      console.error('ERROR:', err);
    }
  });
}

function getFilePath(bundleName, locale) {
  return path.resolve(BASE_DIR, bundleName, LOCALE_FILES[locale]);
}

module.exports = {availableLocales, getBundle, writeBundle};