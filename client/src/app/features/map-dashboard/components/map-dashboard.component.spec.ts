import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MapDashboardModule } from '../map-dashboard.module';
import { MapDashboardComponent } from './map-dashboard.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MapDashboardComponent', () => {

    let fixture: ComponentFixture<MapDashboardComponent>;
    let component: MapDashboardComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports:
                [
                    MapDashboardModule,
                    HttpClientTestingModule,
                ],
        });

        fixture = TestBed.createComponent(MapDashboardComponent);
        component = fixture.debugElement.componentInstance;
        fixture.detectChanges();
    });

    it('setup', () => {
        expect(component).toBeTruthy();
    });

});
