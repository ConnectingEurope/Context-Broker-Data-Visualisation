import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigDashboardComponent } from './config-dashboard.component';
import { ConfigDashboardModule } from '../config-dashboard.module';

describe('StatsDashboardComponent', () => {

    let fixture: ComponentFixture<ConfigDashboardComponent>;
    let component: ConfigDashboardComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports:
                [
                    ConfigDashboardModule,
                    HttpClientTestingModule,
                ],
        });

        fixture = TestBed.createComponent(ConfigDashboardComponent);
        component = fixture.debugElement.componentInstance;
        fixture.detectChanges();
    });

    it('setup', () => {
        expect(component).toBeTruthy();
    });

});
