import {Component, Input} from "@angular/core";
import {Router} from "@angular/router";

@Component({
  selector: 'app-shared-back-panel',
  templateUrl: './back-panel.component.html'
})
export class BackPanelComponent {
  @Input() title: string = '';
  @Input() mdiClass: string = '';
  @Input() backRoute: string[] = [];
  constructor(private router: Router) {
  }
  async back() {
    await this.router.navigate(this.backRoute);
  }
}
