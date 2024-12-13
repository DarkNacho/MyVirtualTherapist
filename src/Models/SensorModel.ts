export interface SensorData {
  sensor_type: string;
  device: string;
  timestamp_epoch: number;
  timestamp_millis: number;
  value: number;
}

export interface SensorStats {
  minValue: number;
  maxValue: number;
  avgValue: number;
}

export interface Sensor {
  data: SensorData[];
  stats: SensorStats;
}

export type SensorDataByDevice = Record<string, Record<string, Sensor>>; // keys = device, sensor
