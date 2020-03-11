import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigDashboardComponent } from './components/config-dashboard.component';
import { ConfigDashboardRoutingModule } from './config-dashboard-routing.module';

@NgModule({
  declarations: [
    ConfigDashboardComponent,
  ],
  imports: [
    CommonModule,
    ConfigDashboardRoutingModule,
  ],
})
export class ConfigDashboardModule { }
