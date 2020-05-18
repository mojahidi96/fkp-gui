const oracledb = require('oracledb');
const dbConfig = require('./database');

function parseResults(rows) {
  let obj = {};
  rows.forEach(r => obj[r[0]] = r[1]);
  return obj;
}

function getRowsByBundleAndLocale(bundle, locale) {
  let dbConnection;

  const promise = new Promise((resolve, reject) => {
    oracledb.getConnection(dbConfig)
      .then(connection => {
        dbConnection = connection;
        return connection.execute('SELECT KEY, VALUE FROM SNCR_DRB_BUNDLE WHERE BUNDLE = :bundle AND LOCALE = :locale', [bundle, locale]);
      })
      .then(result => resolve(result))
      .catch(err => {
        reject(err);
        console.error('ERROR:', err.message);
      })
      .then(() => {
        if (dbConnection) {
          dbConnection.close(err => {
            if (err) console.error(err.message);
          });
        }
      });
  });

  return promise;
}

module.exports = {parseResults, getRowsByBundleAndLocale};