import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainPageComponent} from "./pages/main/main-page.component";

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'configuration', loadChildren: () => import('./pages/configuration/configuration.module').then(m => m.ConfigurationModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
