'use strict';

const MiAirPuriferAdapter = require('./mi-air-purifier-adapter');

module.exports = (addonManager, manifest) => {
  new MiAirPuriferAdapter(addonManager, manifest);
};
