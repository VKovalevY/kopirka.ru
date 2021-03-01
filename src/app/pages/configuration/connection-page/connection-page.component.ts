import {Component, OnInit} from "@angular/core";
import {DataService} from "../../../services/data.service";
import {Router} from "@angular/router";

// @ts-ignore
@Component({
  selector: 'app-connection-page',
  templateUrl: './connection-page.component.html'
})
export class ConnectionPageComponent implements OnInit {
  extraKeys: string[] = ['http://', 'https://', '.ru', '.com', '[sysnumber]'];
  fontName: string = 'Ubuntu';
  placeholder = 'Введите URL';
  confirmTitle = 'Применить';
  value: string[] = [];
  constructor(private dataService: DataService, private router: Router) {
  }
  async onConfirm(value: string[]) {
    this.dataService.url = value;
    await this.router.navigate(['configuration', 'configuration']);
  }

  ngOnInit(): void {
    const url = this.dataService.url;
    if(url != null) {
      this.value = url;
    }
  }
}
