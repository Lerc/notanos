Terminal = process.env.COVERAGE ? require('' + '../index-cov.js') : require('../index.js');
expect = require("expect.js");
