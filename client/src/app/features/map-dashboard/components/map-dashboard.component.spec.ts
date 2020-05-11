import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MapDashboardModule } from '../map-dashboard.module';
import { MapDashboardComponent } from './map-dashboard.component';

describe('MapDashboardComponent', () => {

    let fixture: ComponentFixture<MapDashboardComponent>;
    let component: MapDashboardComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports:
                [
                    MapDashboardModule,
                    HttpClientTestingModule,
                    RouterTestingModule,
                ],
        });

        fixture = TestBed.createComponent(MapDashboardComponent);
        component = fixture.debugElement.componentInstance;
        //fixture.detectChanges();
    });

    it('setup', () => {
        expect(component).toBeTruthy();
    });

});
