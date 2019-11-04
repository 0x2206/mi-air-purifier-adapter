import { AvailableCapabilities, AvailableProperties } from './enums';

export interface MiioDeviceEnvelope {
  id: number
  address: string // IP
  port: number
  token: Buffer | null
  autoToken: boolean
  device: MiioDevice
  matches: (_: string) => boolean
}

export interface MiioDevice {
  id: string
  metadata: MiioMetadata
  internalPoll: () => void
  handle: {
    ref: {}
    api: {}
  }
  miioModel: 'zhimi.airpurifier.m1' | 'zhimi.airpurifier.v1' | 'zhimi.airpurifier.v2' | 'zhimi.airpurifier.v3' | 'zhimi.airpurifier.v4' | 'zhimi.airpurifier.v5' | 'zhimi.airpurifier.v6'
  _properties: {}
  _propertiesToMonitor: []
  _propertyDefinitions: {}
  _reversePropertyDefinitions: {}
  poll: () => void
  management: MiioDeviceManagement
  matches: (_: string) => boolean
}

export interface MiioDeviceManagement {
  api: {} // TODO
}

export interface MiioMetadata {
  types: Set<'miio:air-purifier' | 'sensor' | 'miio' | 'air-purifier'>
  capabilities: Set<'miio:buzzer' | 'miio:led-brightness' | 'miio:switchable-led' | 'pm2.5' | 'relative-humidity' | 'temperature' | 'switchable-mode' | 'mode' | 'switchable-power' | 'restorable-state' | 'power' | 'state'>
  action: {} // TODO
  state: {} // TODO
  events: {} // TODO
}

export interface WebThingDevice {
  '@type': ('OnOffSwitch' | 'BinarySensor' | 'MultiLevelSwitch' | 'Light' | 'SmartPlug' | 'ColorControl' | 'EnergyMonitor')[]
}

export interface Property {
  name: string
  metadata: {
    '@type': AvailableProperties
    title: string
    type: 'boolean' | 'number' | 'string'
    unit?: string
    value: any
    readOnly?: boolean
    minimum?: number
    maximum?: number
    enum?: (string|number)[]
  },
}
