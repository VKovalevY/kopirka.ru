import {Component} from "@angular/core";
import {DataService} from "../../../services/data.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-change-pin-page',
  templateUrl: './change-pin-page.component.html',
  styleUrls:['./change-pin-page.component.scss']
})
export class ChangePinPageComponent {
  count: number = 4;
  constructor(private dataService: DataService, private router: Router) { }
  async onPinComplete(pin: string): Promise<any> {
    this.dataService.pin = pin;
    await this.router.navigate(['configuration', 'configuration'])
  }
}
