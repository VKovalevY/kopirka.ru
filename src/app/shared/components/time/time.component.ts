import {Component, Input, OnInit, Output, EventEmitter} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {TimeData} from "../../interfaces/time";

@Component({
  selector: 'app-shared-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss']
})
export class TimeComponent {
  //@ts-ignore()
  @Input() hour: number = 0;
  @Input() minute: number = 0
  @Output() complete = new EventEmitter<TimeData>()
  get inlineHour(): string {
    return this.normalize(this.hour, '');
  }
  get inlineMinute(): string {
    return this.normalize(this.minute, '');
  }
  hourUp() {
    if(this.hour == 23) this.hour = 0;
    else this.hour = this.hour + 1;
  }
  hourDown() {
    if(this.hour == 0) this.hour = 23;
    else this.hour = this.hour - 1;
  }
  minuteUp() {
    if(this.minute == 59) {
      this.hourUp();
      this.minute = 0;
    }
    else this.minute = this.minute + 1;
  }
  minuteDown() {
    if(this.minute == 0) {
      this.hourDown();
      this.minute = 59;
    }
    else this.minute = this.minute - 1;
  }
  completeTime() {
    this.complete.emit(<TimeData>{hour: this.hour, minute: this.minute});
  }
  private normalize(value: number, suffix: string) : string {
    let v = value.toString();
    if (v.length == 1) v = '0' + v;
    if (suffix != null)
      v += suffix;
    return v;
  }
}
