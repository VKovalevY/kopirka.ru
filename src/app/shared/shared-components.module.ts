import {NgModule} from "@angular/core";
import {SharedServicesModule} from "./shared-services.module";
import {PinComponent} from "./components/pin/pin.component";
import {DialogComponent} from "./components/dialog/dialog.component";
import {ToolboxComponent} from "./components/toolbox/toolbox.component";
import {CommonModule} from "@angular/common";
import {BackPanelComponent} from "./components/back-panel/back-panel.component";
import {KeyboardComponent} from "./components/keyboard/keyboard.component";
import {SafeHtmlPipe} from "./components/safe-html-pipe/SafeHtmlPipe";
import {TimeComponent} from "./components/time/time.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ChangePinComponent} from "./components/change-pin/change-pin.component";

@NgModule({
  declarations: [
    PinComponent,
    DialogComponent,
    ToolboxComponent,
    BackPanelComponent,
    KeyboardComponent,
    SafeHtmlPipe,
    TimeComponent,
    ChangePinComponent
  ],
  imports: [
    FormsModule,
    SharedServicesModule,
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    PinComponent,
    DialogComponent,
    ToolboxComponent,
    BackPanelComponent,
    KeyboardComponent,
    TimeComponent,
    ChangePinComponent
  ],
  providers: []
})
export class SharedComponentsModule {
}
