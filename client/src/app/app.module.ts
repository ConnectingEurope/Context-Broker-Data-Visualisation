import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenubarModule } from 'primeng/menubar';
import { HttpClientModule } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { MessageService, ConfirmationService } from 'primeng/api';
import { PopupComponent } from './shared/templates/popup/popup.component';

@NgModule({
    declarations: [
        AppComponent,
        PopupComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        MenubarModule,
        ToastModule,
        ConfirmDialogModule,
        NgHttpLoaderModule.forRoot(),
    ],
    providers: [
        MessageService,
        ConfirmationService,
    ],
    entryComponents: [PopupComponent],
    bootstrap: [AppComponent],
})
export class AppModule { }
