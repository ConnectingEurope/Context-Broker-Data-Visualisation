import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StatsDashboardComponent } from './stats-dashboard.component';

const routes: Routes = [{ path: '', component: StatsDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatsDashboardRoutingModule { }
