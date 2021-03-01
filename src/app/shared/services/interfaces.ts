export interface Device {
  name: string,
  mac: string,
  serial: string,
  model: string
}
export interface Display {
  canvasSize: string,
  dpi: number,
  bitDepth: number,
  colorSpace: string,
  size: string,
  aspectRatio: number
}
export interface Version {
  systemSoftware: string,
  uiSoftware: string,
  netControllerSoftware: string,
  eipSoftware: string
}
export interface DeviceInfo {
  device: Device;
  display: Display;
  version: Version;
}
