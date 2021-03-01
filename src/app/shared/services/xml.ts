import {Injectable} from "@angular/core";
@Injectable()
export class Xml {
  constructor() {
  }
  getElement(info: any, name: string): any {
    return xrxGetTheElement(info, name);
  }
  getElementValue(info: any, name: string): any {
    return xrxGetElementValue(info, name);
  }
  findElements(element: any, name: string): any {
    return xrxFindElements(element, name);
  }
  stringToDom(str: string): any {
    return xrxStringToDom(str);
  }
}

declare function xrxStringToDom(str: string): any;
declare function xrxGetElementValue(info: any, name: string): any;
declare function xrxGetTheElement(info: any, name: string): any;
declare function xrxFindElements(xmldoc: string, name: string): any;
