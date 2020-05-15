import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ServiceConfigurationComponent } from './service-configuration.component';
import { ConfigDashboardModule } from '../../config-dashboard.module';
import { AppMessageService } from 'src/app/shared/services/app-message-service';
import { ConfirmationService } from 'primeng/api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ServiceConfigurationComponent', () => {

    let fixture: ComponentFixture<ServiceConfigurationComponent>;
    let component: ServiceConfigurationComponent;

    beforeEach(() => {
        const appMessageServiceSpyObj: any = jasmine.createSpyObj('AppMessageService', ['add']);
        const confirmationServiceSpyObj: any = jasmine.createSpyObj('ConfirmationService', ['confirm']);

        TestBed.configureTestingModule({
            imports:
                [
                    ConfigDashboardModule,
                    HttpClientTestingModule,
                    BrowserAnimationsModule,
                ],
            providers: [
                { provide: AppMessageService, useValue: appMessageServiceSpyObj },
                { provide: ConfirmationService, useValue: confirmationServiceSpyObj },
            ],
        });

        fixture = TestBed.createComponent(ServiceConfigurationComponent);
        component = fixture.debugElement.componentInstance;
    });

    it('setup', () => {
        expect(component).toBeTruthy();
    });

});
