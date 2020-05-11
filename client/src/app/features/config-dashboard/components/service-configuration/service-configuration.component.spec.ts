import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ServiceConfigurationComponent } from './service-configuration.component';
import { ConfigDashboardModule } from '../../config-dashboard.module';
import { AppMessageService } from 'src/app/shared/services/app-message-service';
import { ConfirmationService } from 'primeng/api';
import { FormGroup, FormControl } from '@angular/forms';
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
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ServiceConfigurationComponent);
        component = fixture.debugElement.componentInstance;

        component.cb = {
            header: '',
            form: new FormGroup({ url: new FormControl() }),
            historicalForm: new FormGroup({}),
            services: [],
            entities: [],
            selectedEntities: [],
        };

        fixture.detectChanges();
    });

    it('setup', () => {
        expect(component).toBeTruthy();
    });

});
