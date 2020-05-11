import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ServiceConfigurationComponent } from './service-configuration.component';
import { ConfigDashboardModule } from '../../config-dashboard.module';

describe('MapDashboardComponent', () => {

    let fixture: ComponentFixture<ServiceConfigurationComponent>;
    let component: ServiceConfigurationComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports:
                [
                    ConfigDashboardModule,
                    HttpClientTestingModule,
                ],
        });

        fixture = TestBed.createComponent(ServiceConfigurationComponent);
        component = fixture.debugElement.componentInstance;
        //fixture.detectChanges();
    });

    it('setup', () => {
        expect(component).toBeTruthy();
    });

});
