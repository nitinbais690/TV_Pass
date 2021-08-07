const sonarqubeScanner = require('sonarqube-scanner');

sonarqubeScanner(
    {
        serverUrl: 'http://sdd-isk8wrkrn-c2-05.quickplay.local:32489/sonar',
        token: '1ecfde0de8aba266b6aa0131d58fd5ccfadf4219',
        options: {
            'sonar.projectKey': 'tvpass-ui',
            'sonar.projectName': 'tvpass-ui',
            'sonar.sources':
                'src/components/qp-common-ui/src/,src/components/qp-discovery-ui/src/,src/components/qp-playerController-ui/src/',
            'sonar.exclusions': '',
            'sonar.tests': 'src/components/qp-common-ui/__tests__/,src/components/qp-discovery-ui/__tests__/',
            'sonar.typescript.lcov.reportPaths': 'coverage/lcov.info',
            'sonar.testExecutionReportPaths': 'reports/test-report.xml',
            'sonar.eslint.reportPaths': 'reports/eslint-report.json',
        },
    },
    () => {},
);
