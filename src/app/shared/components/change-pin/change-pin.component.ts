import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";

@Component({
  selector: 'app-shared-change-pin',
  templateUrl: 'change-pin.component.html'
})
export class ChangePinComponent implements OnInit {
  keys: number[] = [];
  nums: number[] = [];
  mode_header: string = 'Введите PIN'
  mode: 'first' | 'second' = 'first';
  first_pin: string = '';
  errorMessage: string = ';'
  showError: boolean = false;
  @Input() count: number = 4;
  @Output() completeEnter = new EventEmitter<string>();

  ngOnInit(): void {
    this.keys = new Array<number>();
    this.nums = Array.from({length: (this.count)}, (v, k) => k + 1);
  }
  enter(n: number): void {
    if (this.keys.length < this.count) {
      this.keys.push(n);
      if (this.keys.length === this.count) {
        if(this.mode == 'first') {
          this.first_pin = this.keys.join('');
          this.keys = new Array<number>();
          this.mode_header = 'Введите PIN еще раз';
          this.mode = 'second';
        }
        else {
          const second_pin = this.keys.join('');
          if (this.first_pin != second_pin) {
            this.errorMessage = 'PIN не совпадают. Повторите ввод.'
            this.showError = true;
            this.keys = new Array<number>();
            this.mode_header = 'Введите PIN';
            this.mode = 'first';
          }
          else {
            this.completeEnter.emit(this.first_pin);
          }
        }
      }
    }
  }
  back(): void {
    if (this.keys && this.keys.length > 0) {
      this.keys.pop();
    }
  }
  dialogOk() {
    this.showError = false;
  }
}
