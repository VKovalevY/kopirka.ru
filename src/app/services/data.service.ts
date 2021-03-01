import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Data, Account} from "./interfaces";
import {DeviceService} from "../shared/services/device.service";
import {DeviceInfo} from "../shared/services/interfaces";
import {Subject} from "rxjs";
import {TimeData} from "../shared/interfaces/time";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  //@ts-ignore()
  localData: Data | null = null;
  //@ts-ignore()
  lastDownloadDate: Date;
  //@ts-ignore()
  nextDownloadDate: Date;
  public dataSubject: Subject<Data> | null = null;
  //private host = 'http://192.168.1.70';
  private host = 'http://127.0.0.1';
  private pinItemName = 'pin';
  private urlItemName = 'url';
  private timeDataItemName = 'datatime';
  private dataItemName = 'data';
  private serialNumItemName = 'serial';
  private accountItemName = 'account';
  private defaultPin = '1111';
  private defaultTimeData = <TimeData>{hour: 0, minute: 0};
  private noUrlMessage = 'Произведите настройку приложения';
  private gatDateMessage = 'Ошибка связи с сервером';
  private millisecondsOfDay = 86400000;
  private deviceInfo: DeviceInfo | null = null;
  private updateTimerId: number = -1;
  //@ts-ignore()
  private internalPin: string;
  //@ts-ignore()
  private internalUrl: string[] | null;
  //@ts-ignore()
  private internalTimeData: TimeData;
  //@ts-ignore()
  private internalData: Data;
  //@ts-ignore()
  private internalSerial: string | null;
  private internalAccount: Account | null = null;
  constructor(private http: HttpClient, private deviceService: DeviceService) {
    this.dataSubject = new Subject<Data>();
    this.internalPin = this.getPin();
    this.internalUrl = this.getUrl();
    this.internalTimeData = this.getTimeData();
    this.internalAccount = this.getAccount();
    this.reCalcDate();
    this.internalSerial = this.getSerial();
    if (this.internalSerial === null) {
      this.deviceService.getDeviceInfo(this.host)
        .then(deviceInfo => {
          this.deviceInfo = deviceInfo;
          localStorage.setItem(this.serialNumItemName, deviceInfo.device.serial);
          this.internalSerial = deviceInfo.device.serial;
          this.fetchData();
          this.updateTimer();
        })
        .catch(() => this.fetchData())
    } else {
      this.fetchData();
      this.updateTimer();
    }
  }

  get pin() {
    return this.internalPin;
  }

  set pin(value: string) {
    this.internalPin = value;
    localStorage.setItem(this.pinItemName, value);
  }

  get url(): string[] | null {
    return this.internalUrl;
  }

  set url(value: string[] | null) {
    this.internalUrl = value;
    if (value === null || value == []) {
      localStorage.removeItem(this.urlItemName);
    } else {
      localStorage.setItem(this.urlItemName, JSON.stringify(value));
    }
    this.fetchData(true);
  }

  get timeData(): TimeData {
    return this.internalTimeData;
  }

  set timeData(value: TimeData) {
    if (value === null) {
      localStorage.setItem(this.timeDataItemName, JSON.stringify(this.defaultTimeData));
      this.internalTimeData = this.defaultTimeData;
    } else {
      localStorage.setItem(this.timeDataItemName, JSON.stringify(value));
      this.internalTimeData = value;
    }
    this.reCalcDate();
    this.updateTimer();
  }

  get data(): Data {
    return this.internalData;
  }

  set data(value: Data) {
    this.internalData = value;
    this.dataSubject?.next(value);
    localStorage.setItem(this.dataItemName, JSON.stringify(value));
  }
  get account(): Account | null {
    return this.internalAccount;
  }
  set account(value: Account | null) {
    this.internalAccount = value;
    if (value === null) {
      localStorage.removeItem(this.accountItemName);
    } else {
      localStorage.setItem(this.accountItemName, JSON.stringify(value));
    }
  }
  private reCalcDate() {
    const currentDate = new Date();
    const timerDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), this.internalTimeData.hour, this.internalTimeData.minute);
    if (timerDate.getTime() < currentDate.getTime()) {
      timerDate.setTime(timerDate.getTime() + this.millisecondsOfDay);
    }
    this.nextDownloadDate = timerDate;
    const date = new Date(this.nextDownloadDate);
    date.setTime(date.getTime() - this.millisecondsOfDay);
    this.lastDownloadDate = date;
  }

  private getPin(): string {
    const pin = localStorage.getItem(this.pinItemName);
    if (pin === null) {
      localStorage.setItem(this.pinItemName, this.defaultPin);
      return this.defaultPin;
    } else {
      return pin;
    }
  }

  private getUrl(): string[] | null {
    const value = localStorage.getItem(this.urlItemName);
    if (value == null) return null;
    return JSON.parse(value);
  }

  private getTimeData(): TimeData {
    const value = localStorage.getItem(this.timeDataItemName);
    if (value == null) return this.defaultTimeData;
    else {
      return <TimeData>JSON.parse(value);
    }
  }

  private getSerial(): string | null {
    return localStorage.getItem(this.serialNumItemName);
  }

  private getData(): Data | null {
    const data = localStorage.getItem(this.dataItemName);
    if (data === null) {
      return null;
    } else {
      return <Data>JSON.parse(data, (k, v) => {
        if (k == 'date') return new Date(v);
        else return v;
      });
    }
  }
  private getAccount(): Account | null {
    const s = localStorage.getItem(this.accountItemName);
    if (s === null) return null;
    else {
      return <Account> JSON.parse(s);
    }
  }
  private fetchData(force: boolean = false) {
    const data = this.getData();
    if (force || data === null || data.date === null || data.date.getTime() < this.lastDownloadDate.getTime()) {
      if (this.url === null || this.url.length < 2) {
        this.data = <Data>{
          image: null,
          code: null,
          date: null,
          message: this.noUrlMessage
        }
      } else {
        let url = this.url.join('');
        if (this.internalSerial != null) {
          url = url.replace('[sysnumber]', this.internalSerial);
          const subscribe = this.http.get<Data>(url).subscribe(
            (data) => {
              data.date = new Date();
              this.data = data;
              subscribe.unsubscribe();
            },
            (error) => {
              this.data = <Data>{
                image: null,
                code: null,
                date: null,
                message: this.gatDateMessage
              }
              subscribe.unsubscribe();
            }
          );
        }
      }
    } else {
      this.data = data;
    }
  }

  private updateTimer() {
    if (this.updateTimerId != -1) {
      clearTimeout(this.updateTimerId)
    }
    const startInterval = this.nextDownloadDate.getTime() - new Date().getTime()
    this.updateTimerId = setTimeout(() => {
      this.fetchData(true);
      setTimeout(() => {
        this.reCalcDate();
        this.updateTimer();
      }, 100);
    }, startInterval);
  }
}
