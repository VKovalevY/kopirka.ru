import {Component, ViewChild} from "@angular/core";
import {PinComponent} from "../../../shared/components/pin/pin.component";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../../../services/data.service";

@Component({
  selector: 'app-pin-page',
  templateUrl: './pin-page.component.html'
})
export class PinPageComponent {
  public errorMessage: string | null;
  public showError: boolean;
  @ViewChild('pin') pinRef: PinComponent | null = null;
  private pinErrorMessage = 'Введен неверный PIN';
  count: number = 4;
  constructor(private dataService: DataService, private router: Router, private route: ActivatedRoute) {
    this.showError = false;
    this.errorMessage = null;
  }
  onPinComplete(pin: string): void {
    if (this.dataService.pin !== pin) {
      this.errorMessage = this.pinErrorMessage;
      this.showError = true;
    }
    else {
      this.router.navigate([ 'configuration', 'configuration' ]).then(() => {});
    }
  }
  dialogOk(): void {
    this.closeDialog();
  }
  closeDialog(): void {
    this.errorMessage = null;
    this.showError = false;
    if(this.pinRef != null)
      this.pinRef.clear();
  }
}
