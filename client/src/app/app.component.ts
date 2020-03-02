import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  protected menuItems: MenuItem[];

  ngOnInit(): void {
    this.loadMenu();
  }

  private loadMenu(): void {
    this.menuItems = [
      { label: 'Map', icon: 'pi pi-map-marker', routerLink: '/map-dashboard' },
      { label: 'Stats', icon: 'pi pi-desktop', routerLink: '/stats-dashboard' },
    ];
  }

}
