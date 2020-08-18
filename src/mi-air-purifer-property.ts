import { Property } from 'gateway-addon';
import { device as miioDevice } from 'miio';
import MiAirPurifierDevice from './mi-air-purifier-device';

export default class MiAirPuriferProperty extends Property {
  constructor(device: MiAirPurifierDevice, name: string, propertyDescription: {value: any}) {
    super(device, name, propertyDescription);

    // Update with predefined value
    this.setValue(propertyDescription.value);

    // Listen for changes
    miioDevice({address: device.address})
      .then((dev: any) => {
        // console.log('!! dev', device);

        return dev.call(`${name}`).then((_: any) => {
          // tslint:disable-next-line
          console.log('!! then', _);
          this.setValue(_.value || _, 'device');
        })
        .catch((err: any) => {
          // tslint:disable-next-line
          console.log('!! err', err);
        });

        // dev.on(`${name}Changed`, (_: any) => {
        //   // this.setValue(_.value || _);
        //   this.setValue(_.value || _, 'device');
        // });

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
  setValue(value: any, source = 'ui') {
    return new Promise((resolve, reject) => {
      if (source === 'ui') { // TODO: clean it up
        miioDevice({address: this.device.address})
        .then((device: any) => {
          // tslint:disable-next-line no-unused-expression
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
