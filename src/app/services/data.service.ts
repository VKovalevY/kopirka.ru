import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Data, Account, app} from "./interfaces";
import {DeviceService} from "../shared/services/device.service";
import {DeviceInfo} from "../shared/services/interfaces";
import {Observable, Subject} from "rxjs";
import {TimeData} from "../shared/interfaces/time";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  //@ts-ignore()
  localData: Data | null = null;
  //@ts-ignore()
  //lastDownloadDate: Date;
  //@ts-ignore()
  //nextDownloadDate: Date;
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
  private getDateMessage = 'Ошибка связи с сервером';
  private errorStartApplication  = 'Ошибка запуска приложения';
  private nextDownloadDateItemName = 'nextDownloadDate';
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
    this.internalSerial = this.getSerial();
    if (this.internalSerial == null) {
      this.readConfig().subscribe(
        (result) => {
          if (result.url != null) {
            this.url = result.url;
          }
          if (result.pin != null) {
            this.pin = result.pin;
          }
          if (result.account != null) {
            this.account = result.account;
          }
          if (result.datatime != null) {
            this.timeData = result.datatime;
          }
        },
        (error) => {}
      );
    }
  }
  start() {
    if (this.internalSerial === null) {
      this.deviceService.getDeviceInfo(this.host)
        .then(deviceInfo => {
          this.deviceInfo = deviceInfo;
          localStorage.setItem(this.serialNumItemName, deviceInfo.device.serial);
          this.internalSerial = deviceInfo.device.serial;
          this.fetchData(true);
        })
        .catch(() => {
          this.fetchData();
        });
    } else {
      this.fetchData();
    }
  }
  stop() {
    if (this.updateTimerId != -1) {
      clearTimeout(this.updateTimerId)
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
  set nextDownloadDate(value: Date) {
    localStorage.setItem(this.nextDownloadDateItemName, value.toString());
  }
  get nextDownloadDate(): Date {
    let dateString: string | null = localStorage.getItem(this.nextDownloadDateItemName);
    if (dateString == null) {
      this.reCalcDate();
    }
    dateString = <string> localStorage.getItem(this.nextDownloadDateItemName);
    return new Date(dateString);
  }
  private reCalcDate() {
    const currentDate = new Date();
    const timerDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), this.internalTimeData.hour, this.internalTimeData.minute);
    if (timerDate.getTime() < currentDate.getTime()) {
      timerDate.setTime(timerDate.getTime() + this.millisecondsOfDay);
    }
    this.nextDownloadDate = timerDate;
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
    if (this.internalSerial == null) {
      this.data = <Data>{
        image: null,
        code: null,
        date: null,
        message: this.errorStartApplication
      }
      this.updateTimer();
    }
    else {
      if (this.internalUrl == null || this.internalUrl.length < 2) {
        this.data = <Data>{
          image: null,
          code: null,
          date: null,
          message: this.noUrlMessage
        }
        this.updateTimer();
      }
      else {
        const data = this.getData();
        const currentDate = new Date();
        const nextDownloadDate = this.nextDownloadDate;
        if (force || data?.image == null || data?.date === null || currentDate.getTime() > nextDownloadDate.getTime()) {
          let url = this.internalUrl.join('');
          url = url.replace('[sysnumber]', this.internalSerial);
          const subscribe = this.http.get<Data>(url).subscribe(
            (data) => {
              data.date = new Date();
              this.data = data;
              subscribe.unsubscribe();
              this.reCalcDate();
              this.updateTimer();
            },
            (error) => {
              this.data = <Data>{
                image: null,
                code: null,
                date: null,
                message: this.getDateMessage
              }
              subscribe.unsubscribe();
              this.updateTimer();
            }
          );
        }
        else {
          this.data = data;
          this.updateTimer();
        }
      }
    }
  }

  private updateTimer() {
    if (this.updateTimerId != -1) {
      clearTimeout(this.updateTimerId)
    }
    let startInterval = 2000;
    if(this.internalData?.image != null) {
      startInterval = this.nextDownloadDate.getTime() - new Date().getTime()
    }
    this.updateTimerId = setTimeout(() => {
      this.fetchData(true);
    }, startInterval);
  }
  private readConfig() : Observable<app> {
    return this.http.get<app>("app.json")
  }
}
