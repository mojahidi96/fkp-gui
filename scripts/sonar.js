const scanner = require('sonarqube-scanner');
const package = require('../package');

const options = {
  'sonar.projectKey': 'VODAFONEFKPGUI',
  'sonar.projectName': 'Vodafone FKP GUI',
  'sonar.projectVersion': package.version,
  'sonar.sourceEncoding': 'UTF-8',
  'sonar.sources': '.',
  'sonar.exclusions': '**/node_modules/**,**/*.spec.ts,mocked-db/**,e2e/**,dist/**,storybook/**',
  'sonar.tests': 'ng-app',
  'sonar.test.inclusions': '**/*.spec.ts',
  'sonar.language': 'ts',
  'sonar.ts.excludetypedefinitionfiles': 'true',
  'sonar.genericcoverage.unitTestReportPaths': 'coverage/test-report.xml',
  'sonar.typescript.lcov.reportPaths': 'coverage/lcov.info'
};

scanner({serverUrl: 'http://sonar.synchronoss.net/', options}, () => process.exit());
