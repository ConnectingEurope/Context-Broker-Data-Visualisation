import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigDashboardModule } from '../../config-dashboard.module';
import { HistoricalConfigurationComponent } from './historical-configuration.component';

describe('HistoricalConfigurationComponent', () => {

    let fixture: ComponentFixture<HistoricalConfigurationComponent>;
    let component: HistoricalConfigurationComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports:
                [
                    ConfigDashboardModule,
                    HttpClientTestingModule,
                ],
        });

        fixture = TestBed.createComponent(HistoricalConfigurationComponent);
        component = fixture.debugElement.componentInstance;
    });

    it('setup', () => {
        expect(component).toBeTruthy();
    });

});
