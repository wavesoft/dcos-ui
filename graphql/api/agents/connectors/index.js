import { mockEndpoints, runLocally } from '../../../Config';

let path = './server';

if (mockEndpoints) {
  path = './mock';
}

if (runLocally) {
  path = './local';
}

module.exports = require(path);
