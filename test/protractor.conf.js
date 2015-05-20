exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  framework: 'jasmine',

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  }
};
