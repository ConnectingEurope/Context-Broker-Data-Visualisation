import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';
import { AccordionTabHeaderComponent } from './templates/accordion-tab-header/accordion-tab-header.component';
import { JsonDialogComponent } from './templates/json-dialog/json-dialog.component';
import { DialogModule } from 'primeng/dialog';
import { ClipboardModule } from 'ngx-clipboard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    declarations: [
        AccordionTabHeaderComponent,
        JsonDialogComponent,
    ],
    imports: [
        CommonModule,
        ButtonModule,
        TableModule,
        AccordionModule,
        DialogModule,
        ClipboardModule,
        BrowserAnimationsModule,
    ],
    exports: [
        CommonModule,
        ButtonModule,
        TableModule,
        AccordionModule,
        DialogModule,
        ClipboardModule,
        BrowserAnimationsModule,
        AccordionTabHeaderComponent,
        JsonDialogComponent,
    ],
})
export class SharedModule {
    public static forRoot(): ModuleWithProviders<SharedModule> {
        return {
            ngModule: SharedModule,
            providers: [],
        };
    }
}
