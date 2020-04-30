import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';
import { AccordionTabHeaderComponent } from './templates/accordion-tab-header/accordion-tab-header.component';

@NgModule({
    declarations: [
        AccordionTabHeaderComponent,
    ],
    imports: [
        CommonModule,
        ButtonModule,
    ],
    exports: [
        PanelModule,
        ButtonModule,
        TableModule,
        AccordionModule,
        AccordionTabHeaderComponent,
    ],
})
export class SharedModule {
    public static forRoot(): ModuleWithProviders<SharedModule> {
        return {
            ngModule: SharedModule,

            // Here are defined the services that must be shared in all modules (lazy or not).
            // It is important in order to share the same instance of the Service.
            providers: [],
        };
    }
}
