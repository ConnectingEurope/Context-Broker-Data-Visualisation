import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapDashboardRoutingModule } from './map-dashboard-routing.module';
import { MapDashboardComponent } from './components/map-dashboard.component';
import { TreeModule } from 'primeng/tree';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { InputSwitchModule } from 'primeng/inputswitch';
import { LayerConditionsComponent } from './components/layer-conditions/layer-conditions.component';


@NgModule({
    declarations: [MapDashboardComponent, LayerConditionsComponent],
    imports: [
        CommonModule,
        MapDashboardRoutingModule,
        TreeModule,
        SidebarModule,
        ButtonModule,
        OverlayPanelModule,
        FormsModule,
        CheckboxModule,
        DropdownModule,
        InputSwitchModule,
    ],
})
export class MapDashboardModule { }
