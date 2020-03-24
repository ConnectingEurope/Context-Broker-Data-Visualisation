import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  protected menuItems: MenuItem[];

  public ngOnInit(): void {
    this.loadMenu();
  }

  private loadMenu(): void {
    this.menuItems = [
      { label: 'Map', icon: 'pi pi-globe', routerLink: '/map-dashboard' },
      { label: 'Configuration', icon: 'pi pi-list', routerLink: '/config-dashboard' },
    ];
  }

}
