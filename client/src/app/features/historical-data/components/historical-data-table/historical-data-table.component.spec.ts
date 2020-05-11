import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HistoricalDataTableComponent } from './historical-data-table.component';
import { HistoricalDataModule } from '../../historical-data.module';

describe('MapDashboardComponent', () => {

    let fixture: ComponentFixture<HistoricalDataTableComponent>;
    let component: HistoricalDataTableComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports:
                [
                    HistoricalDataModule,
                    HttpClientTestingModule,
                ],
        });

        fixture = TestBed.createComponent(HistoricalDataTableComponent);
        component = fixture.debugElement.componentInstance;
        //fixture.detectChanges();
    });

    it('setup', () => {
        expect(component).toBeTruthy();
    });

});
