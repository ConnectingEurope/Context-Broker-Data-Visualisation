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
import { MessageModule } from 'primeng/message';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { GeneralConfigurationComponent } from './components/general-configuration/general-configuration.component';
import { ServiceConfigurationComponent } from './components/service-configuration/service-configuration.component';
import { HistoricalConfigurationComponent } from './components/historical-configuration/historical-configuration.component';
import { InputWithValidationComponent } from 'src/app/shared/templates/input-with-validation/input-with-validation.component';
import { AccordionTabHeaderComponent } from 'src/app/shared/templates/accordion-tab-header/accordion-tab-header.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AttributeSelectorComponent } from 'src/app/shared/templates/attribute-selector/attribute-selector.component';
import { SubscriptionsDialogComponent } from './components/subscriptions-dialog/subscriptions-dialog.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
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
        MessageModule,
    ],
    declarations: [
        ConfigDashboardComponent,
        GeneralConfigurationComponent,
        ServiceConfigurationComponent,
        HistoricalConfigurationComponent,
        SubscriptionsDialogComponent,
        InputWithValidationComponent,
        AttributeSelectorComponent,
    ],
    providers: [],
})
export class ConfigDashboardModule { }
