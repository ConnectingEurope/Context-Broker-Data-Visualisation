import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigDashboardComponent } from './components/config-dashboard.component';
import { ConfigDashboardRoutingModule } from './config-dashboard-routing.module';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { BlockUIModule } from 'primeng/blockui';
import { TableModule } from 'primeng/table';
import { TreeModule } from 'primeng/tree';
import { MessageService } from 'primeng/api';
import { GeneralConfigurationComponent } from './components/general-configuration/general-configuration.component';
import { ServiceConfigurationComponent } from './components/service-configuration/service-configuration.component';

@NgModule({
  declarations: [
    ConfigDashboardComponent,
    GeneralConfigurationComponent,
    ServiceConfigurationComponent,
  ],
  imports: [
    CommonModule,
    ConfigDashboardRoutingModule,
    AccordionModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    ToastModule,
    BlockUIModule,
    TableModule,
    TreeModule,
  ],
  providers: [
    MessageService,
  ],
})
export class ConfigDashboardModule { }
