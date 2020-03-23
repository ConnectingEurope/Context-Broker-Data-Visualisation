import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigDashboardComponent } from './components/config-dashboard.component';
import { ConfigDashboardRoutingModule } from './config-dashboard-routing.module';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { BlockUIModule } from 'primeng/blockui';
import { TableModule } from 'primeng/table';
import { TreeModule } from 'primeng/tree';
import { CheckboxModule } from 'primeng/checkbox';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { MessageService } from 'primeng/api';
import { GeneralConfigurationComponent } from './components/general-configuration/general-configuration.component';
import { ServiceConfigurationComponent } from './components/service-configuration/service-configuration.component';
import { AccordionTabHeaderComponent } from 'src/app/shared/templates/accordion-tab-header/accordion-tab-header.component';

@NgModule({
  declarations: [
    ConfigDashboardComponent,
    GeneralConfigurationComponent,
    ServiceConfigurationComponent,
    AccordionTabHeaderComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
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
    CheckboxModule,
    ScrollPanelModule,
  ],
  providers: [
    MessageService,
  ],
})
export class ConfigDashboardModule { }
