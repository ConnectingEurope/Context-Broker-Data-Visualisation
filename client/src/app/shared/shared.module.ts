import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
    ],
    exports: [
        PanelModule,
        ButtonModule,
        TableModule,
    ],
})
export class SharedModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,

            // Here are defined the services that must be shared in all modules (lazy or not).
            // It is important in order to share the same instance of the Service.
            providers: [],
        };
    }
}
