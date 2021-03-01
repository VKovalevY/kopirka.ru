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
  private readonly handler: EventListener;
  private dataSubscription: Subscription | undefined;
  private stateSubscription: Subscription | undefined;
  isEvent = false;
  eventMessage: string | null = null;
  constructor(
      @Inject(DOCUMENT) private document: Document,
      private router: Router,
      private dataService: DataService,
      private jobManagementService: JobManagementService) {
    this.handler = async (event: Event) => {
      await this.router.navigate(['']);
    };
    document.addEventListener( 'resume', this.handler, false );
    document.addEventListener( 'suspend', this.handler, false );
    this.dataSubscription = dataService.dataSubject?.subscribe({
      next: (data: Data) => {
        this.data = data;
      }
    })
    this.stateSubscription = jobManagementService.stateSubject?.subscribe({
      next: (data: jobInfo) => {
        console.log('data', data)
        if(data == null) {
          this.eventMessage = null;
          this.isEvent = false;
        }
        else {
          this.eventMessage = this.buildMessage(data);
          this.isEvent = true;
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
    this.jobManagementService.beginJobsRoll(user, password);
  }
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent): void {
    if (event.which === 16) {
      this.router.navigate(['configuration']).then(r => console.log('navigate configuration'));
    }
  }
  ngOnInit() {
    if(this.data == null) {
      this.data = this.dataService.data;
    }
  }
  ngOnDestroy(): void {
    this.dataSubscription?.unsubscribe();
    this.stateSubscription?.unsubscribe();
    this.jobManagementService.stopJobRoll();
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
