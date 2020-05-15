import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapDashboardComponent } from './components/map-dashboard.component';

const routes: Routes = [{ path: '', component: MapDashboardComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MapDashboardRoutingModule { }
