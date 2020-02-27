import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

import { StatsDashboardRoutingModule } from './stats-dashboard-routing.module';
import { StatsDashboardComponent } from './stats-dashboard.component';


@NgModule({
  declarations: [StatsDashboardComponent],
  imports: [
    CommonModule,
    StatsDashboardRoutingModule,
    CardModule
  ]
})
export class StatsDashboardModule { }
