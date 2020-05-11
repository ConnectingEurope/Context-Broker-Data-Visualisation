import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HistoricalDataModule } from '../../historical-data.module';
import { HistoricalDataGraphComponent } from './historical-data-graph.component';

describe('MapDashboardComponent', () => {

    let fixture: ComponentFixture<HistoricalDataGraphComponent>;
    let component: HistoricalDataGraphComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports:
                [
                    HistoricalDataModule,
                    HttpClientTestingModule,
                ],
        });

        fixture = TestBed.createComponent(HistoricalDataGraphComponent);
        component = fixture.debugElement.componentInstance;
        //fixture.detectChanges();
    });

    it('setup', () => {
        expect(component).toBeTruthy();
    });

});
