'use strict';

const {Property} = require('gateway-addon');
const miio = require('miio');

class MiAirPuriferProperty extends Property {
  /**
   *
   * @param {MiAirPurifierDevice} device
   * @param {string} name
   * @param {Object} propertyDescription
   */
  constructor(device, name, propertyDescription) {
    super(device, name, propertyDescription);

    // Update with predefined value
    this.setValue(propertyDescription.value);

    // Listen for changes
    miio.device({address: device.address})
      .then((device) => {
        // console.log('!! dev', device);

        device.on(`${name}Changed`, (_) => {
          // this.setValue(_.value || _);
          this.setValue(_.value || _, 'device');
        });

        // device.pm2_5().then((_) => this.setValue(_));
        // device.on('temperature', (temp) => {
        //   console.log('!! t', temp);
        // });
      });

    // this.setCachedValue(propertyDescription.value);
    // this.device.notifyPropertyChanged(this);
  }

  /**
   * Set the value of the property.
   *
   * @param {*} value The new value to set
   * @param {string} source Source of event
   * @returns a promise which resolves to the updated value.
   *
   * @note it is possible that the updated value doesn't match
   * the value passed in.
   */
  setValue(value, source = 'ui') {
    return new Promise((resolve, reject) => {
      if (source === 'ui') { // TODO: clean it up
        miio
          .device({address: this.device.address})
          .then((device) => {
            typeof device[this.name] === 'function' && device[this.name](value); // TODO: clean it up
          });
      }

      // HACK: Omit parent class validation for read only properties
      if (this.readOnly) {
        this.setCachedValueAndNotify(value);
        resolve(this.value);
      } else {
        super.setValue(value);
      }
    });
  }
}

exports.MiAirPuriferProperty = MiAirPuriferProperty;
