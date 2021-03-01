import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {ConfigurationLayoutComponent} from "./configuration-layout.component";
import {PinPageComponent} from "./pin-page/pin-page.component";
import {SharedComponentsModule} from "../../shared/shared-components.module";
import {CommonModule} from "@angular/common";
import {ConfigurationPageComponent} from "./configuration-page/configuration-page.component";
import {ConnectionPageComponent} from "./connection-page/connection-page.component";
import {ExpirationTimeComponent} from "./expiration-time/expiration-time.component";
import {ChangePinPageComponent} from "./change-pin-page/change-pin-page.component";
import {AccountPageComponent} from "./account-page/account-page.component";

@NgModule({
  declarations: [
    ConfigurationLayoutComponent,
    PinPageComponent,
    ConfigurationPageComponent,
    ConnectionPageComponent,
    ExpirationTimeComponent,
    ChangePinPageComponent,
    AccountPageComponent
  ],
  imports: [
    SharedComponentsModule,
    CommonModule,
    RouterModule.forChild([
        {
          path: '', component: ConfigurationLayoutComponent,
          children: [
            { path: '', component: PinPageComponent, data: {
                title: 'Введите PIN'
              } },
            { path: 'configuration', component: ConfigurationPageComponent, data: {
                title: 'Настройки приложения'
              } },
            { path: 'change-pin', component: ChangePinPageComponent, data: {
                title: 'Настройки приложения',
                panelTitle: 'Смена PIN',
                panelClass: 'mdi mdi-form-textbox-password'
              }
            },
            { path: 'connection', component: ConnectionPageComponent, data: {
                title: 'Настройки приложения',
                panelTitle: 'Настройки подключения',
                panelClass: 'mdi mdi-lan-pending'
              }
            },
            {
              path: 'account', component: AccountPageComponent, data: {
                title: 'Настройки приложения',
                panelTitle: 'Настройки учетной записи',
                panelClass: 'mdi mdi-shield-account-variant'
              }
            },
            {
              path: 'expiration-time', component: ExpirationTimeComponent, data: {
                title: 'Настройки приложения',
                panelTitle: 'Время обновления данных',
                panelClass: 'mdi mdi-timeline-clock'
              }
            }
          ]
        }
    ])
  ],
  exports: [],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ConfigurationModule { }
