const config = {
  retries: 0,
  reporter: [
    ['list'],
    ['json', {  outputFile: 'test-results/js-run.json' }]
  ],
  projects: [
    {
      name: 'Desktop Safari',
      use: {
        PROJECT_NAME: 'desktopSafari',
        screenshot: 'only-on-failure',
        browserName: 'webkit'
      }
    },
    {
      name: 'Desktop Chromium',
      use: {
        PROJECT_NAME: 'desktopChrome',
        screenshot: 'only-on-failure',
        browserName: 'chromium',
        viewport: { width: 1300, height: 800 }
      }
    }
  ],
};

module.exports = config;