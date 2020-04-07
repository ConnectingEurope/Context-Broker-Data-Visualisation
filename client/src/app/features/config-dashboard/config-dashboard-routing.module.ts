import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfigDashboardComponent } from './components/config-dashboard.component';

const routes: Routes = [{ path: '', component: ConfigDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigDashboardRoutingModule { }
