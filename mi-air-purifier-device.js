'use strict';

const {Device} = require('gateway-addon');
const {MiAirPuriferProperty} = require('./mi-air-purifer-property');
const {MiAirPurifierAPIHandler} = require('./mi-air-purifier-api-handler');

class MiAirPurifierDevice extends Device {
  constructor(adapter, id, deviceDescription) {
    super(adapter, id);
    this.name = deviceDescription.name;
    this.type = deviceDescription.type;
    this['@type'] = deviceDescription['@type'];
    this.description = deviceDescription.description;
    for (const propertyName in deviceDescription.properties) {
      const propertyDescription = deviceDescription.properties[propertyName];
      const property = new MiAirPuriferProperty(this, propertyName, propertyDescription);
      this.properties.set(propertyName, property);
    }
    if (MiAirPurifierAPIHandler) {
      this.links.push({
        rel: 'alternate',
        mediaType: 'text/html',
        href: `/extensions/mi-air-purifier-adapter?thingId=${encodeURIComponent(this.id)}`,
      });
    }
  }
}

exports.MiAirPurifierDevice = MiAirPurifierDevice;
