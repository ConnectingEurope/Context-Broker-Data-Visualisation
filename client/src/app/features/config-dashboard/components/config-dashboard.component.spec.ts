import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfigDashboardComponent } from './config-dashboard.component';
import { ConfigDashboardModule } from '../config-dashboard.module';
import { AppMessageService } from 'src/app/shared/services/app-message-service';
import { ConfirmationService } from 'primeng/api';

describe('ConfigDashboardComponent', () => {

    let fixture: ComponentFixture<ConfigDashboardComponent>;
    let component: ConfigDashboardComponent;

    beforeEach(() => {
        const appMessageServiceSpyObj: any = jasmine.createSpyObj('AppMessageService', ['add']);
        const confirmationServiceSpyObj: any = jasmine.createSpyObj('ConfirmationService', ['confirm']);

        TestBed.configureTestingModule({
            imports:
                [
                    ConfigDashboardModule,
                    HttpClientTestingModule,
                    RouterTestingModule,
                ],
            providers: [
                { provide: AppMessageService, useValue: appMessageServiceSpyObj },
                { provide: ConfirmationService, useValue: confirmationServiceSpyObj },
            ],
        });

        fixture = TestBed.createComponent(ConfigDashboardComponent);
        component = fixture.debugElement.componentInstance;
        // fixture.detectChanges();
    });

    it('setup', () => {
        expect(component).toBeTruthy();
    });

});
