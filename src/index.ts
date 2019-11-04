import MiAirPuriferAdapter from './mi-air-purifier-adapter';

module.exports = (addonManager: any, manifest: any) => {
  // tslint:disable-next-line no-unused-expression
  new MiAirPuriferAdapter(addonManager, manifest);
};
