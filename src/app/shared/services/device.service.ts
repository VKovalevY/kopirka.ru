import { Xml } from './xml';
import {Device, DeviceInfo, Display, Version} from './interfaces';
import {Injectable} from "@angular/core";
@Injectable()
export class DeviceService {
  constructor(private xml: Xml) { }
  getDeviceInfo(host: string): Promise<DeviceInfo> {
    return new Promise((resolve, reject) => {
      xrxDeviceConfigGetDeviceInfo(host,
        (req: string, res: string) => {
        const root = xrxDeviceConfigParseGetDeviceInfo(res);
        const deviceNode = this.xml.getElement(root, "device");
        const device: Device = {
          name: this.xml.getElementValue(deviceNode, "name"),
          mac: this.xml.getElementValue(deviceNode, "mac"),
          serial: this.xml.getElementValue(deviceNode, "serial"),
          model: this.xml.getElementValue(deviceNode, "model")
        };

        const displayNode = this.xml.getElement(root, "display");
        const canvasSizeDisplayNode = this.xml.getElement(displayNode, "canvasSize");
        const physicalDisplayNode = this.xml.getElement(displayNode, "physical");

        const display: Display = {
          canvasSize: `${this.xml.getElementValue(canvasSizeDisplayNode, "width")}x${this.xml.getElementValue(canvasSizeDisplayNode, "height")}`,
          dpi: this.xml.getElementValue(displayNode, "dpi"),
          bitDepth: this.xml.getElementValue(displayNode, "bitdepth"),
          colorSpace: this.xml.getElementValue(displayNode, "colorspace"),
          size: this.xml.getElementValue(physicalDisplayNode, "size"),
          aspectRatio: this.xml.getElementValue(physicalDisplayNode, "aspectRatio"),
        };

        const versionNode = this.xml.getElement(root, "version");
        const version: Version = {
          systemSoftware: this.xml.getElementValue(versionNode, "systemSoftware"),
          uiSoftware: this.xml.getElementValue(versionNode, "uiSoftware"),
          netControllerSoftware: this.xml.getElementValue(versionNode, "netControllerSoftware"),
          eipSoftware: "unknown"
        };

        const eipSoftwareNode = this.xml.getElement(versionNode, "eipSoftware");
        const majorVersion = this.xml.getElementValue(eipSoftwareNode, "majorVersion");
        const minorVersion = this.xml.getElementValue(eipSoftwareNode, "minorVersion");
        const revision = this.xml.getElementValue(eipSoftwareNode, "revision");

        version.eipSoftware = `${majorVersion}.${minorVersion}.${revision}`;
        const result = {
          device,
          display,
          version
        };
        resolve(result);
      },
        (req: string, res: string, status: any) => {
        this.failureCallback(req, res, status, resolve, reject);
      });
    });
  }

  failureCallback(req: string, res: string, status: any, resolve: (value?: any) => void, reject: (reason?: any) => void) {
    return reject({ handled: false, data: res });
  }
}

declare function xrxDeviceConfigGetDeviceInfo(address: string, success: any, failure: any): void;
declare function xrxDeviceConfigParseGetDeviceInfo(response: any): any;
