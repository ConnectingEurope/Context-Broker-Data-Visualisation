import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapDashboardRoutingModule } from './map-dashboard-routing.module';
import { MapDashboardComponent } from './map-dashboard.component';
import { TreeModule } from 'primeng/tree';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@NgModule({
  declarations: [MapDashboardComponent],
  imports: [
    CommonModule,
    MapDashboardRoutingModule,
    TreeModule,
    SidebarModule,
    ButtonModule,
    OverlayPanelModule
  ]
})
export class MapDashboardModule { }
