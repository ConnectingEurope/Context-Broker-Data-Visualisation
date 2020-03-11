import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigDashboardComponent } from './components/config-dashboard.component';
import { ConfigDashboardRoutingModule } from './config-dashboard-routing.module';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ConfigDashboardComponent,
  ],
  imports: [
    CommonModule,
    ConfigDashboardRoutingModule,
    AccordionModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
  ],
})
export class ConfigDashboardModule { }
