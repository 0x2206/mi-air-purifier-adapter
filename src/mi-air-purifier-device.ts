import { Device, Adapter } from 'gateway-addon';
import MiAirPuriferProperty from './mi-air-purifer-property';
import { Property, MiioDeviceEnvelope } from './contracts';
import { WebThingsProperties, WebThingsCapabilities } from './enums';
// const {MiAirPurifierAPIHandler} = require('./mi-air-purifier-api-handler');

// const MiIOProperties = {
//   temperature: 'temperature',
//   pm25: 'pm2.5',
// }

const properties: Property[] = [{
  name: 'power',
  metadata: {
    value: 'off',
    title: 'Power',
    type: 'boolean',
    '@type': WebThingsProperties.OnOffProperty,
  },
}, {
  name: 'aqi',
  metadata: {
    value: 0,
    title: 'PM2.5',
    type: 'number',
    '@type': WebThingsProperties.LevelProperty,
    unit: 'µg/m³',
    minimum: 0,
    readOnly: true,
  },
}, {
  name: 'temp_dec',
  metadata: {
    value: 20.0,
    title: 'Temperature',
    type: 'number',
    '@type': WebThingsProperties.TemperatureProperty,
    unit: 'ºC',
    readOnly: true,
  },
}, {
  name: 'humidity',
  metadata: {
    value: 50,
    title: 'Humidity',
    type: 'number',
    '@type': WebThingsProperties.LevelProperty,
    unit: '%',
    minimum: 0,
    maximum: 100,
    readOnly: true,
  },
}, {
  name: 'mode',
  metadata: {
    value: 'favorite', // TODO: Add `idle`
    title: 'Mode',
    type: 'string',
    '@type': WebThingsProperties.MultiLevelSwitch,
    enum: ['auto', 'silent', 'favorite'], // TODO: Add `idle` support
  },
}, {
  name: 'favorite_level',
  metadata: {
    value: 4, // Most effective level considering generated noise
    title: 'Favorite mode speed',
    type: 'number',
    '@type': WebThingsProperties.MultiLevelSwitch,
    enum: Array.from(Array(17).keys()),
  },
}, {
  name: 'filter1_life',
  metadata: {
    value: 100,
    title: 'Filter remaining',
    type: 'number',
    '@type': WebThingsProperties.LevelProperty,
    unit: '%',
    minimum: 0,
    maximum: 100,
    readOnly: true,
  },
// }, {
//   name: 'filterLifespan',
//   metadata: {
//     value: 150,
//     title: 'Filter lifespan',
//     type: 'number',
//     '@type': AvailableProperties.LevelProperty,
//     unit: 'days',
//     minimum: 0,
//     maximum: 150,
//     readOnly: true,
//   },
}];

const actions = [{
  name: 'turbo',
  metadata: {
    '@type': 'SwitchModeAction',
    title: 'Turbo mode',
  },
}, {
  name: 'balanced',
  metadata: {
    '@type': 'SwitchModeAction',
    title: 'Balanced mode',
  },
}];

const events = properties.map((prop) => {
  return {
    name: '`${prop.name}` changed',
    // type: prop.type,
    metadata: {
      '@type': '',
      title: '',
    },
  };
});

export default class MiAirPurifierDevice extends Device {
  constructor(adapter: any, deviceEnvelope: MiioDeviceEnvelope) {
    const deviceId = `mi-air-purifier-${deviceEnvelope.id}`; // TODO: change to `miio:ID_HERE`?

    super(adapter, deviceId);

    this.deviceEnvelope = deviceEnvelope;

    this.setName();

    this.description = 'Mi Air Purifier Device';

    this.address = deviceEnvelope.address;

    this['@type'] = [
      WebThingsCapabilities.MultiLevelSensor,
    ];

    properties.forEach((prop) => {
      this.properties.set(prop.name, new MiAirPuriferProperty(this, prop.name, prop.metadata));
    });

    actions.forEach((action) => {
      this.addAction(action.name, action.metadata);
    });

    events.forEach((event) => {
      this.addEvent(event.name, event.metadata);
    });

    this.links.push({
      rel: 'alternate',
      mediaType: 'text/html',
      href: `/extensions/mi-air-purifier-adapter?thingId=${encodeURIComponent(this.id)}`,
    });
  }

  setName(name = 'Mi Air Purifier') {
    this.name = `${name}: #${this.deviceEnvelope.id} (${this.deviceEnvelope.address})`;
  }
}
