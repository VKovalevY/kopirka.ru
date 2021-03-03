import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {Xml} from "./xml";
import {jobInfo} from "../interfaces/job-info";

@Injectable()
export class JobManagementService {
  public stateSubject: Subject<any> | null = null;
  private interval: number = 1000;
  //private host = 'http://192.168.1.70';
  private host = 'http://127.0.0.1';
  user: string | null = null;
  password: string | null = null;
  private timerId: number = -1;
  private currentJobId: string | null = null;
  constructor(private xml: Xml) {
    this.stateSubject = new Subject<jobInfo>();
  }
  beginJobsRoll(user: string | null,  password: string | null) {
    this.user = user;
    this.password = password;
    this.roll();
  }
  stopJobRoll() {
    if (this.timerId != -1) {
      clearTimeout(this.timerId);
      this.timerId = -1
    }
  }
  private getJobListQueue(host: string, active: boolean = true): Promise<jobInfo[]> {
    const func = active ? xrxJobMgmtListActiveQueue : xrxJobMgmtListCompletedQueue;
    return new Promise<any>((resolve, reject) => {
      func(host,
        (req: string, res: string)=> {
          this.resolveHandler(req, res, resolve);
      },
      (req: string, res: string, status: any) => {
        this.failureCallback(req, res, status, resolve, reject);
      })
    });
  }
  private getJobListQueueSecure(host: string, user: string, password: string, active: boolean = true): Promise<jobInfo[]> {
    const func = active ? xrxJobMgmtListActiveQueueSecure : xrxJobMgmtListCompletedQueueSecure;
    return new Promise<any>((resolve, reject) => {
      func(host, null, null, user, password,
        (req: string, res: string)=> {
          this.resolveHandler(req, res, resolve);
        },
        (req: string, res: string, status: any) => {
          this.failureCallback(req, res, status, resolve, reject);
        })
    });
  }
  private getJobDetail(host: string, jobType: string, jobId: string) : Promise<jobInfo> {
    return new Promise<jobInfo>((resolve, reject) => {
      xrxJobMgmtGetJobDetails(host, jobType, jobId, (req: string, res: string) => {
        const element = xrxJobMgmtParseGetJobDetails(res);
        const jobInfo = this.parseJobInfo(element);
        resolve(jobInfo);
      },
      (req: string, res: string, status: any) => {
        this.failureCallback(req, res, status, resolve, reject);
      });
    });
  }
  private getJobDetailSecure(host: string, jobType: string, jobId: string, user: string, password: string) : Promise<jobInfo> {
    return new Promise<jobInfo>((resolve, reject) => {
      xrxJobMgmtGetJobDetailsSecure(host, jobType, jobId, null, null, user, password, (req: string, res: string) => {
          const element = xrxJobMgmtParseGetJobDetails(res);
          const jobInfo = this.parseJobInfo(element);
          resolve(jobInfo);
        },
        (req: string, res: string, status: any) => {
          this.failureCallback(req, res, status, resolve, reject);
        });
    });
  }
  private parseJobInfo(element: object): jobInfo {
    const jobId = this.xml.getElementValue(element, 'JobId');
    const jobName = this.xml.getElementValue(element, 'JobName');
    const jobType = this.xml.getElementValue(element, 'JobType');
    const jobState = this.xml.getElementValue(element, 'JobState');
    const jobStateReasons: string[] = [];
    const jobStateReasonsElements = this.xml.findElements(element, 'JobStateReasons');
    if(jobStateReasonsElements != null && jobStateReasonsElements.length > 0) {
      for(let jobStateReasonsElement of jobStateReasonsElements) {
        let jobStateReason = this.xml.getElementValue(jobStateReasonsElement, 'JobStateReasons');
        jobStateReasons.push(jobStateReason)
      }
    }
    const dateTimeAtCompletedString = this.xml.getElementValue(element, 'DateTimeAtCompleted');
    let dateTimeAtCompleted: Date | null = null;
    if (dateTimeAtCompletedString != null) {
      dateTimeAtCompleted = new Date(dateTimeAtCompletedString)
    }
    let dateTimeAtCreationString = this.xml.getElementValue(element, 'DateTimeAtCreation');
    let dateTimeAtCreation: Date | null = null;
    if (dateTimeAtCreationString != null) {
      dateTimeAtCreation = new Date(dateTimeAtCreationString)
    }
    return <jobInfo> {
      jobId: jobId,
      jobName: jobName,
      jobType: jobType,
      jobState: jobState,
      jobStateReasons: jobStateReasons,
      dateTimeAtCompleted: dateTimeAtCompleted,
      dateTimeAtCreation: dateTimeAtCreation
    };
  }
  private resolveHandler(req: string, res: string, resolve: (value: any) => void) {
    const root = xrxJobMgmtParseListQueueSecure( res );
    const elements = this.xml.findElements(root, 'JobInfo');
    if (elements != null && elements.length > 0) {
      const result = new Array<jobInfo>();
      for(let element of elements) {
        result.push(this.parseJobInfo(element))
      }
      resolve(result);
    }
    resolve([]);
  }
  private roll() {
    if (this.user != null && this.user != '' && this.password != null && this.password != '') {
      this.getJobListQueueSecure(this.host, this.user, this.password, true)
        .then((result) => {
          this.processRollListQueue(result);
        })
        .catch(e => {})
    }
    else {
      this.getJobListQueue(this.host, true)
        .then((result) => {
          this.processRollListQueue(result);
        })
        .catch(e => {})
    }
  }
  processRollListQueue(result: jobInfo[]) {
    if (result != null && result.length > 0) {
      this.currentJobId = result[0].jobId;
      this.stateSubject?.next(result[0]);
      setTimeout(() => this.rollCurrentJob(), 1000);
    }
    else
      this.timerId = setTimeout(() => this.roll(), 1000);
  }
  rollCurrentJob() {
    if(this.currentJobId != null) {
      if (this.user != null && this.user != '' && this.password != null && this.password != '') {
        this.getJobDetailSecure(this.host, "Print", this.currentJobId, this.user, this.password)
          .then((result) => {
            this.processJobDetail(result);
          })
          .catch(e => {})
      }
      else {
        this.getJobDetail(this.host, "Print", this.currentJobId)
          .then((result) => {
            this.processJobDetail(result);
          })
          .catch(e => {})
      }
    }
  }
  processJobDetail(result: jobInfo) {
    this.stateSubject?.next(result);
    if (result.jobState == 'Completed') {
      setTimeout(
        () => {
          this.stateSubject?.next(null);
          this.roll();
        }, 4000);
    } else {
      this.timerId = setTimeout(() => this.rollCurrentJob(), 1000);
    }
  }
  failureCallback(req: string, res: string, status: any, resolve: (value?: any) => void, reject: (reason?: any) => void) {
    return reject({ handled: false, data: res });
  }
}
declare function xrxJobMgmtListActiveQueue( url: string, callback_success: any, callback_failure: any): void;
declare function xrxJobMgmtListActiveQueueSecure(
    url: string,
    admin: string | null,
    adminPassword: string | null,
    username: string | null,
    password: string | null,
    callback_success: any,
    callback_failure: any ): void;
declare function xrxJobMgmtListCompletedQueue( url: string, callback_success: any, callback_failure: any ): void;
declare function xrxJobMgmtListCompletedQueueSecure(
    url: string,
    admin: string | null,
    adminPassword: string | null,
    username: string | null,
    password: string | null,
    callback_success: any,
    callback_failure: any): void;
declare function xrxJobMgmtParseListQueueSecure( response: string ): any;
declare function xrxJobMgmtGetJobDetails( url: string, jobType: string, jobId: string, callback_success: any, callback_failure: any ): void;
declare function xrxJobMgmtParseGetJobDetails( response: string ): any;
declare function xrxJobMgmtGetJobDetailsSecure(
    url: string,
    jobType: string,
    jobId: string,
    admin: string | null,
    adminPassword: string | null,
    username: string | null,
    password: string | null,
    callback_success: any,
    callback_failure: any ): void;
