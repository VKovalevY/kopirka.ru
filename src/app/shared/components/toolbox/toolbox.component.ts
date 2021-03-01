import {Component, Input, Output, EventEmitter} from "@angular/core";
import {toolboxItem} from "../../interfaces/toolbox-item";

@Component({
  selector: 'app-shared-toolbox',
  templateUrl: './toolbox.component.html'
})
export class ToolboxComponent {
  // @ts-ignore
  @Input() data: toolboxItem[];
  @Output() click = new EventEmitter<string>();
  public onClick(page: string): void {
    this.click.emit(page);
  }
}
