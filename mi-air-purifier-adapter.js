/**
 * mi-air-purifier-adapter.js - Mi Air Purifier adapter.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const {
  Adapter,
  Device,
  Property,
} = require('gateway-addon');

let MiAirPurifierAPIHandler = null;
try {
  MiAirPurifierAPIHandler = require('./mi-air-purifier-api-handler');
} catch (e) {
  console.log(`API Handler unavailable: ${e}`);
  // pass
}

class MiAirPuriferProperty extends Property {
  constructor(device, name, propertyDescription) {
    super(device, name, propertyDescription);
    this.setCachedValue(propertyDescription.value);
    this.device.notifyPropertyChanged(this);
  }

  /**
   * Set the value of the property.
   *
   * @param {*} value The new value to set
   * @returns a promise which resolves to the updated value.
   *
   * @note it is possible that the updated value doesn't match
   * the value passed in.
   */
  setValue(value) {
    return new Promise((resolve, reject) => {
      super.setValue(value).then((updatedValue) => {
        resolve(updatedValue);
        this.device.notifyPropertyChanged(this);
      }).catch((err) => {
        reject(err);
      });
    });
  }
}

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
        // eslint-disable-next-line max-len
        href: `/extensions/mi-air-purifier-adapter?thingId=${encodeURIComponent(this.id)}`,
      });
    }
  }
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
    console.log('MiAirPuriferAdapter:', this.name,
                'id', this.id, 'pairing started');
  }

  /**
   * Cancel the pairing/discovery process.
   */
  cancelPairing() {
    console.log('MiAirPuriferAdapter:', this.name, 'id', this.id,
                'pairing cancelled');
  }

  /**
   * Unpair the provided the device from the adapter.
   *
   * @param {Object} device Device to unpair with
   */
  removeThing(device) {
    console.log('MiAirPuriferAdapter:', this.name, 'id', this.id,
                'removeThing(', device.id, ') started');

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
    console.log('MiAirPuriferAdapter:', this.name, 'id', this.id,
                'cancelRemoveThing(', device.id, ')');
  }
}

module.exports = MiAirPuriferAdapter;
