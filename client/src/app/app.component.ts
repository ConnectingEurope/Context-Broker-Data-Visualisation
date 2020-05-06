import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

    public menuItems: MenuItem[];

    public ngOnInit(): void {
        this.loadMenu();
    }

    private loadMenu(): void {
        this.menuItems = [
            { label: 'Map', icon: 'fas fa-globe-europe', routerLink: '/map-dashboard' },
            { label: 'Configuration', icon: 'fas fa-cog', routerLink: '/config-dashboard' },
        ];
    }

}
