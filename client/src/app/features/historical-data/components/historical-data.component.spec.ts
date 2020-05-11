import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HistoricalDataComponent } from './historical-data.component';
import { HistoricalDataModule } from '../historical-data.module';

describe('MapDashboardComponent', () => {

    let fixture: ComponentFixture<HistoricalDataComponent>;
    let component: HistoricalDataComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports:
                [
                    HistoricalDataModule,
                    HttpClientTestingModule,
                ],
        });

        fixture = TestBed.createComponent(HistoricalDataComponent);
        component = fixture.debugElement.componentInstance;
        //fixture.detectChanges();
    });

    it('setup', () => {
        expect(component).toBeTruthy();
    });

});
