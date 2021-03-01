import {Component} from "@angular/core";
import {DataService} from "../../../services/data.service";
import {TimeData} from "../../../shared/interfaces/time";
import {Router} from "@angular/router";

@Component({
  selector: 'app-expiration-time-page',
  templateUrl: './expiration-time.component.html'
})
export class ExpirationTimeComponent {
  //@ts-ignore()
  timeData: TimeData;
  constructor(private dataService: DataService, private router: Router) {
    this.timeData = dataService.timeData;
  }
  async onTimeData(value: TimeData) {
    this.dataService.timeData = value;
    await this.router.navigate(['configuration', 'configuration']);
  }
}
