import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StatsDashboardComponent } from './stats-dashboard.component';
import { StatsDashboardModule } from '../stats-dashboard.module';

describe('StatsDashboardComponent', () => {

    let fixture: ComponentFixture<StatsDashboardComponent>;
    let component: StatsDashboardComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports:
                [
                    StatsDashboardModule,
                    HttpClientTestingModule,
                ],
        });

        fixture = TestBed.createComponent(StatsDashboardComponent);
        component = fixture.debugElement.componentInstance;
        fixture.detectChanges();
    });

    it('setup', () => {
        expect(component).toBeTruthy();
    });

});
