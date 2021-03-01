import {Component, EventEmitter, Input, Output, OnInit} from "@angular/core";

@Component({
  selector: 'app-shared-pin',
  templateUrl: './pin.component.html'
})
export class PinComponent implements OnInit {
  keys: number[] = [];
  nums: number[] = [];
  @Input() count: number = 4;
  @Output() completeEnter = new EventEmitter<string>();
  ngOnInit(): void {
    this.keys = new Array<number>();
    this.nums = Array.from({length: (this.count)}, (v, k) => k + 1);
  }
  clear(): void {
    this.keys = new Array<number>();
  }
  enter(n: number): void {
    if (this.keys.length < this.count) {
      this.keys.push(n);
      if (this.keys.length === this.count) {
        const enterPin = this.keys.join('');
        this.completeEnter.emit(enterPin);
      }
    }
  }
  back(): void {
    if (this.keys && this.keys.length > 0) {
      this.keys.pop();
    }
  }
}
