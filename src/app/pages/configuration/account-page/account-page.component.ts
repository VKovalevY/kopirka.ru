import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {Account} from '../../../services/interfaces'
import {DataService} from "../../../services/data.service";

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html'
})
export class AccountPageComponent {
  fontName: string = 'Ubuntu';
  value: string[] = [];
  mode: 'admin' | 'password' = 'admin';
  user: string[] = [];
  password: string[] = [];
  constructor(private router: Router, private dataService: DataService) {
    this.mode = 'admin';
    const account = this.dataService.account;
    if (account != null) {
      this.user = account.user;
      this.password = account.password;
    }
    this.value = this.user;
  }
  async onConfirm(value: string[]) {
    if(this.mode == 'admin') {
      this.mode = 'password';
      this.value = this.password;
    }
    else {
      const account = <Account> {
        user: this.user,
        password: this.password
      }
      this.dataService.account = account;
      await this.router.navigate(['configuration', 'configuration']);
    }
  }
  get isPassword(): boolean {
    return this.mode == 'password'
  }
  get placeholder(): string {
    if(this.mode == 'admin')
      return 'Введите имя пользователя устройства';
    else
      return 'Введите пароль';
  }
  get confirmTitle(): string {
    if(this.mode == 'admin')
      return 'Далее';
    else
      return 'Применить';
  }
}
