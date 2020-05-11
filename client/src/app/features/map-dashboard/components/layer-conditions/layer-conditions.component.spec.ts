import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LayerConditionsComponent } from './layer-conditions.component';
import { MapDashboardModule } from '../../map-dashboard.module';

describe('LayerConditionsComponent', () => {

    let fixture: ComponentFixture<LayerConditionsComponent>;
    let component: LayerConditionsComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports:
                [
                    MapDashboardModule,
                    HttpClientTestingModule,
                ],
        });

        fixture = TestBed.createComponent(LayerConditionsComponent);
        component = fixture.debugElement.componentInstance;
    });

    it('setup', () => {
        expect(component).toBeTruthy();
    });

});
