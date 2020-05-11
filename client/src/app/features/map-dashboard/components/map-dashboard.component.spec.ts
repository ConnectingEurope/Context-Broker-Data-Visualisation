import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MapDashboardModule } from '../map-dashboard.module';
import { MapDashboardComponent } from './map-dashboard.component';
import { AppMessageService } from 'src/app/shared/services/app-message-service';
import { ConfirmationService } from 'primeng/api';

describe('MapDashboardComponent', () => {

    let fixture: ComponentFixture<MapDashboardComponent>;
    let component: MapDashboardComponent;

    beforeEach(() => {
        const appMessageServiceSpyObj: any = jasmine.createSpyObj('AppMessageService', ['add']);
        const confirmationServiceSpyObj: any = jasmine.createSpyObj('ConfirmationService', ['confirm']);

        TestBed.configureTestingModule({
            imports:
                [
                    MapDashboardModule,
                    HttpClientTestingModule,
                    RouterTestingModule,
                ],
            providers: [
                { provide: AppMessageService, useValue: appMessageServiceSpyObj },
                { provide: ConfirmationService, useValue: confirmationServiceSpyObj },
            ],
        });

        fixture = TestBed.createComponent(MapDashboardComponent);
        component = fixture.debugElement.componentInstance;
    });

    it('setup', () => {
        expect(component).toBeTruthy();
    });

});
