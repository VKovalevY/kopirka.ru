import {NgModule} from "@angular/core";
import {Xml} from "./services/xml";
import {DeviceService} from "./services/device.service";
import {HttpClientModule} from "@angular/common/http";
import {JobManagementService} from "./services/job-management.service";

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule
  ],
  exports: [
  ],
  providers: [
    DeviceService,
    JobManagementService,
    Xml
  ]
})
export class SharedServicesModule {
}
