import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigDashboardComponent } from './components/config-dashboard.component';
import { ConfigDashboardRoutingModule } from './config-dashboard-routing.module';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BlockUIModule } from 'primeng/blockui';
import { TableModule } from 'primeng/table';
import { TreeModule } from 'primeng/tree';
import { CheckboxModule } from 'primeng/checkbox';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { GeneralConfigurationComponent } from './components/general-configuration/general-configuration.component';
import { ServiceConfigurationComponent } from './components/service-configuration/service-configuration.component';
import { AccordionTabHeaderComponent } from 'src/app/shared/templates/accordion-tab-header/accordion-tab-header.component';
import { HistoricalConfigurationComponent } from './components/historical-configuration/historical-configuration.component';
import { InputWithValidationComponent } from 'src/app/shared/templates/input-with-validation/input-with-validation.component';

@NgModule({
  declarations: [
    ConfigDashboardComponent,
    GeneralConfigurationComponent,
    ServiceConfigurationComponent,
    HistoricalConfigurationComponent,
    AccordionTabHeaderComponent,
    InputWithValidationComponent,
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
    BlockUIModule,
    TableModule,
    TreeModule,
    CheckboxModule,
    ScrollPanelModule,
    TooltipModule,
  ],
  providers: [],
})
export class ConfigDashboardModule { }
