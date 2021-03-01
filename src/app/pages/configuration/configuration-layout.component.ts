import {Component} from "@angular/core";
import {ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router} from "@angular/router";
import {filter, map} from "rxjs/operators";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-configuration-layout-page',
  templateUrl: './configuration-layout.component.html'
})
export class ConfigurationLayoutComponent {
  title: string | null = null;
  backPanel = false;
  // @ts-ignore
  backPanelMdiClass: string = null;
  // @ts-ignore
  backPanelTitle: string = null;
  backRoute = ['configuration','configuration'];
  private routerEventSubscribe: Subscription;
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.routerEventSubscribe = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute.snapshot),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        })
      )
      .subscribe((route: ActivatedRouteSnapshot) => {
        this.title = route.data.title;
        this.backPanelTitle = route.data.panelTitle;
        this.backPanelMdiClass = route.data.panelClass;
      });
  }
  close(): Promise<boolean> {
    return this.router.navigate(['']);
  }
  ngOnDestroy(): void {
    this.routerEventSubscribe.unsubscribe();
  }
}
