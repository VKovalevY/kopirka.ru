import {ActivatedRoute, Router} from "@angular/router";
import {toolboxItem} from "../../../shared/interfaces/toolbox-item";
import {Component} from "@angular/core";
@Component(
  {
    selector: 'app-configuration-page',
    templateUrl: './configuration-page.component.html'
  }
)
export class ConfigurationPageComponent {
  data: toolboxItem[];
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.data = new Array<toolboxItem>();
    if (activatedRoute.parent?.routeConfig?.children != undefined) {
      for (let child of activatedRoute.parent?.routeConfig?.children) {
        if (child.data) {
          if(child.data.panelTitle != undefined && child.data.panelClass) {
            this.data.push(
              <toolboxItem> {
                title: child.data.panelTitle,
                route: child.path,
                mdiClass: child.data.panelClass
              }
            )
          }
        }
      }
    }
  }
  async onToolboxClick(route: string) {
    await this.router.navigate(['configuration', route]);
  }
}
