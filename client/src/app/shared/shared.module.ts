import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
    ],
    exports: [],
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
