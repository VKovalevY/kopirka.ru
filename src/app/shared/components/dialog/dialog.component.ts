import {Component, Input, Output, EventEmitter} from "@angular/core";

@Component({
  selector: 'app-shared-dialog',
  templateUrl: './dialog.component.html'
})
export class DialogComponent {
  @Input() title: string | null = '';
  @Input() message: string | null = '';
  @Output() ok = new EventEmitter();
  constructor() { }
  okClick(): void {
    this.ok.emit();
  }
}
