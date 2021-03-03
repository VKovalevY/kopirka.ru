import {AfterViewInit, Component, HostListener, Inject, Injectable, OnDestroy, OnInit} from "@angular/core";
import {DOCUMENT} from "@angular/common";
import {Router} from "@angular/router";
import {Data} from "../../services/interfaces";
import {DataService} from "../../services/data.service";
import {Subscription} from "rxjs";
import {JobManagementService} from "../../shared/services/job-management.service";
import {jobInfo} from "../../shared/interfaces/job-info";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html'
})
export class MainPageComponent implements OnInit, OnDestroy, AfterViewInit {
  public data: Data | null = null;
  public messageText = 'Сканируйте или введите код для начала печати';
  private readonly resumeHandler: EventListener;
  private readonly suspendHandler: EventListener;
  private dataSubscription: Subscription | undefined;
  private stateSubscription: Subscription | undefined;
  isEvent = false;
  eventMessage: string | null = null;
  constructor(
      @Inject(DOCUMENT) private document: Document,
      private router: Router,
      private dataService: DataService,
      private jobManagementService: JobManagementService) {
    this.resumeHandler = async (event: Event) => {
      await this.router.navigate(['']);
      this.startTracking();
    };
    this.suspendHandler = async (event: Event) => {
      await this.router.navigate(['']);
      this.stopTracking();
    };
    document.addEventListener( 'resume', this.resumeHandler, false );
    document.addEventListener( 'suspend', this.suspendHandler, false );
    this.startTracking();
  }
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent): void {
    if (event.which === 16) {
      this.router.navigate(['configuration']).then(r => console.log('navigate configuration'));
    }
  }
  startTracking() {
    if(this.dataSubscription != undefined) {
      this.dataSubscription.unsubscribe();
      this.dataSubscription = undefined;
    }
    this.dataSubscription = this.dataService.dataSubject?.subscribe({
      next: (data: Data) => {
        this.data = data;
      }
    })
    if (this.stateSubscription != undefined) {
      this.stateSubscription.unsubscribe();
      this.stateSubscription = undefined;
    }
    this.stateSubscription = this.jobManagementService.stateSubject?.subscribe({
      next: (data: jobInfo) => {
        console.log('data', data)
        if(data == null) {
          this.eventMessage = null;
          this.isEvent = false;
        }
        else {
          if (this.data?.image != null) {
            this.eventMessage = this.buildMessage(data);
            this.isEvent = true;
          }
          else {
            this.eventMessage = null;
            this.isEvent = false;
          }
        }
      }
    });
    let user: string | null = null;
    let password: string | null = null;
    if(this.dataService.account?.user != null && this.dataService.account?.user.length > 0) {
      user = this.dataService.account?.user.join('');
    }
    if(this.dataService.account?.password != null && this.dataService.account?.password.length > 0) {
      password = this.dataService.account?.password.join('');
    }
    this.dataService.start();
    this.jobManagementService.beginJobsRoll(user, password);
  }
  stopTracking() {
    this.dataSubscription?.unsubscribe();
    this.dataSubscription = undefined;
    this.stateSubscription?.unsubscribe();
    this.stateSubscription = undefined;
    this.dataService.stop();
    this.jobManagementService.stopJobRoll();
  }
  ngOnInit() {
    if(this.data == null) {
      this.data = this.dataService.data;
    }
  }
  ngOnDestroy(): void {
    this.stopTracking();
  }
  ngAfterViewInit(): void {
  }
  private buildMessage(info: jobInfo) : string {
    switch (info.jobState) {
      case 'Processing': {
        if(info.jobStateReasons.includes('Printing') || info.jobStateReasons.includes('None') ) {
          return 'Идет печать...'
        }
        else {
          return 'Подготовка к печати...'
        }
      }
      case 'Pending':
      case 'PendingHeld': return 'Задержка печати...'
      case 'Canceled': return 'Печать была отменена.'
      case 'Aborted': return 'Ошибка печати.'
      case 'Paused': return 'Пауза...'
      case 'Completed': {
        if(info.jobStateReasons.includes('JobCompletedSuccessfully') || info.jobStateReasons.includes('JobCompletedWithWarnings')) {
          return 'Печать завершена'
        }
        else {
          return 'Печать завершилась ошибкой'
        }
        return `${info.jobState} ${info.jobStateReasons.join()}`;
      }
      default: return `${info.jobState} ${info.jobStateReasons.join()}`;
    }
  }
}
