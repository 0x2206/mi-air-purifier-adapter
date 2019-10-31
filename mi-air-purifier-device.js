'use strict';

const {Device} = require('gateway-addon');
const {MiAirPuriferProperty} = require('./mi-air-purifer-property');
// const {MiAirPurifierAPIHandler} = require('./mi-air-purifier-api-handler');

const AvailableCapabilities = {
  Alarm: 'Alarm',
  BinarySensor: 'BinarySensor',
  Camera: 'Camera',
  ColorControl: 'ColorControl',
  DoorSensor: 'DoorSensor',
  EnergyMonitor: 'EnergyMonitor',
  LeakSensor: 'LeakSensor',
  Light: 'Light',
  Lock: 'Lock',
  MotionSensor: 'MotionSensor',
  MultiLevelSensor: 'MultiLevelSensor',
  MultiLevelSwitch: 'MultiLevelSwitch',
  OnOffSwitch: 'OnOffSwitch',
  PushButton: 'PushButton',
  SmartPlug: 'SmartPlug',
  TemperatureSensor: 'TemperatureSensor',
  Thermostat: 'Thermostat',
  VideoCamera: 'VideoCamera',
};

const AvailableProperties = {
  AlarmProperty: 'AlarmProperty',
  BooleanProperty: 'BooleanProperty',
  BrightnessProperty: 'BrightnessProperty',
  ColorProperty: 'ColorProperty',
  ColorTemperatureProperty: 'ColorTemperatureProperty',
  CurrentProperty: 'CurrentProperty',
  FrequencyProperty: 'FrequencyProperty',
  HeatingCoolingProperty: 'HeatingCoolingProperty',
  ImageProperty: 'ImageProperty',
  InstantaneousPowerProperty: 'InstantaneousPowerProperty',
  LeakProperty: 'LeakProperty',
  LevelProperty: 'LevelProperty',
  LockedProperty: 'LockedProperty',
  MotionProperty: 'MotionProperty',
  OnOffProperty: 'OnOffProperty',
  OpenProperty: 'OpenProperty',
  PushedProperty: 'PushedProperty',
  TargetTemperatureProperty: 'TargetTemperatureProperty',
  TemperatureProperty: 'TemperatureProperty',
  ThermostatModeProperty: 'ThermostatModeProperty',
  VideoProperty: 'VideoProperty',
  VoltageProperty: 'VoltageProperty',
};

// const MiIOProperties = {
//   temperature: 'temperature',
//   pm25: 'pm2.5',
// }

const properties = [{
  name: 'power',
  metadata: {
    value: '',
    title: 'Power',
    type: 'boolean',
    '@type': AvailableProperties.OnOffProperty,
  },
}, {
  name: 'pm2.5',
  metadata: {
    value: 0,
    title: 'PM2.5',
    type: 'number',
    '@type': AvailableProperties.LevelProperty,
    unit: 'µg/m³',
    // description: '',
    minimum: 0,
    // maximum: 25,
    // enum: null,
    readOnly: true,
    // multipleOf: null,
    // links: null,
    // visible: true,
  },
}, {
  name: 'temperature',
  metadata: {
    value: 20,
    title: 'Temperature',
    type: 'number',
    '@type': AvailableProperties.TemperatureProperty,
    unit: 'ºC',
    readOnly: true,
  },
}, {
  name: 'relativeHumidity',
  metadata: {
    value: 50,
    title: 'Humidity',
    type: 'number',
    '@type': AvailableProperties.LevelProperty,
    unit: '%',
    minimum: 0,
    maximum: 100,
    readOnly: true,
  },
}, {
  name: 'mode',
  metadata: {
    value: 'idle',
    title: 'Mode',
    type: 'string',
    '@type': AvailableProperties.MultiLevelSwitch,
    enum: ['idle', 'auto', 'silent', 'favorite'],
  },
}, {
  name: 'favoriteLevel',
  metadata: {
    value: 4, // Most effective level considering generated noise
    title: 'Favorite mode speed',
    type: 'number',
    '@type': AvailableProperties.MultiLevelSwitch,
    enum: [...Array(17).keys()],
  },
}, {
  name: 'filterLifeRemaining',
  metadata: {
    value: 100,
    title: 'Filter remaining',
    type: 'number',
    '@type': AvailableProperties.LevelProperty,
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
    '@type': 'FadeAction',
    title: 'Turbo mode',
    description: 't',
  },
}, {
  name: 'balanced',
  metadata: {
    '@type': 'FadeAction',
    title: 'Balanced mode',
    description: 'b',
  },
}];

// const events = [];

class MiAirPurifierDevice extends Device {
  /**
   *
   * @param {Adapter} adapter
   * @param {MiioDeviceEnvelope} deviceEnvelope
   */
  constructor(adapter, deviceEnvelope) {
    const deviceId = `mi-air-purifier-${deviceEnvelope.id}`; // TODO: change to `miio:ID_HERE`?

    super(adapter, deviceId);

    this.deviceEnvelope = deviceEnvelope;

    this.name = this.setName();

    this.description = 'Mi Air Purifier Device';

    this.address = deviceEnvelope.address;

    this['@type'] = [
      AvailableCapabilities.MultiLevelSensor,
    ];

    properties.forEach((prop) => {
      this.properties.set(prop.name, new MiAirPuriferProperty(this, prop.name, prop.metadata));
    });

    actions.forEach((action) => {
      this.addAction(action.name, action.metadata);
    });

    // events.forEach((event) => {
    //   this.events.set();
    // });

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

exports.MiAirPurifierDevice = MiAirPurifierDevice;
