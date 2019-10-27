'use strict';

const {Adapter} = require('gateway-addon');
const {MiAirPurifierDevice} = require('./mi-air-purifier-device');

let MiAirPurifierAPIHandler = null;
try {
  MiAirPurifierAPIHandler = require('./mi-air-purifier-api-handler');
} catch (e) {
  console.log(`API Handler unavailable: ${e}`);
  // pass
}

class MiAirPuriferAdapter extends Adapter {
  constructor(addonManager, manifest) {
    super(addonManager, 'MiAirPuriferAdapter', manifest.name);
    addonManager.addAdapter(this);

    if (!this.devices['mi-air-purifier-plug']) {
      const device = new MiAirPurifierDevice(this, 'mi-air-purifier-plug', {
        name: 'Mi Air Purifier Plug',
        '@type': ['OnOffSwitch', 'SmartPlug'],
        description: 'Mi Air Purifier Device',
        properties: {
          on: {
            '@type': 'OnOffProperty',
            label: 'On/Off',
            name: 'on',
            type: 'boolean',
            value: false,
          },
        },
      });

      this.handleDeviceAdded(device);
    }

    if (MiAirPurifierAPIHandler) {
      this.apiHandler = new MiAirPurifierAPIHandler(addonManager, this);
    }
  }

  /**
   * Example process to add a new device to the adapter.
   *
   * The important part is to call: `this.handleDeviceAdded(device)`
   *
   * @param {String} deviceId ID of the device to add.
   * @param {String} deviceDescription Description of the device to add.
   * @return {Promise} which resolves to the device added.
   */
  addDevice(deviceId, deviceDescription) {
    return new Promise((resolve, reject) => {
      if (deviceId in this.devices) {
        reject(`Device: ${deviceId} already exists.`);
      } else {
        const device = new MiAirPurifierDevice(this, deviceId, deviceDescription);
        this.handleDeviceAdded(device);
        resolve(device);
      }
    });
  }

  /**
   * Example process to remove a device from the adapter.
   *
   * The important part is to call: `this.handleDeviceRemoved(device)`
   *
   * @param {String} deviceId ID of the device to remove.
   * @return {Promise} which resolves to the device removed.
   */
  removeDevice(deviceId) {
    return new Promise((resolve, reject) => {
      const device = this.devices[deviceId];
      if (device) {
        this.handleDeviceRemoved(device);
        resolve(device);
      } else {
        reject(`Device: ${deviceId} not found.`);
      }
    });
  }

  /**
   * Start the pairing/discovery process.
   *
   * @param {Number} timeoutSeconds Number of seconds to run before timeout
   */
  startPairing(_timeoutSeconds) {
    console.log('MiAirPuriferAdapter:', this.name, 'id', this.id, 'pairing started');
  }

  /**
   * Cancel the pairing/discovery process.
   */
  cancelPairing() {
    console.log('MiAirPuriferAdapter:', this.name, 'id', this.id, 'pairing cancelled');
  }

  /**
   * Unpair the provided the device from the adapter.
   *
   * @param {Object} device Device to unpair with
   */
  removeThing(device) {
    console.log('MiAirPuriferAdapter:', this.name, 'id', this.id, 'removeThing(', device.id, ') started');

    this.removeDevice(device.id).then(() => {
      console.log('MiAirPuriferAdapter: device:', device.id, 'was unpaired.');
    }).catch((err) => {
      console.error('MiAirPuriferAdapter: unpairing', device.id, 'failed');
      console.error(err);
    });
  }

  /**
   * Cancel unpairing process.
   *
   * @param {Object} device Device that is currently being paired
   */
  cancelRemoveThing(device) {
    console.log('MiAirPuriferAdapter:', this.name, 'id', this.id, 'cancelRemoveThing(', device.id, ')');
  }
}

module.exports = MiAirPuriferAdapter;
