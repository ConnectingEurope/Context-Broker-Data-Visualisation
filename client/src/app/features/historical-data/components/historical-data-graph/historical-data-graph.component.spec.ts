import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HistoricalDataModule } from '../../historical-data.module';
import { HistoricalDataGraphComponent } from './historical-data-graph.component';
import { AppMessageService } from 'src/app/shared/services/app-message-service';

describe('HistoricalDataGraphComponent', () => {

    let fixture: ComponentFixture<HistoricalDataGraphComponent>;
    let component: HistoricalDataGraphComponent;

    beforeEach(() => {
        const appMessageServiceSpyObj: any = jasmine.createSpyObj('AppMessageService', ['add']);

        TestBed.configureTestingModule({
            imports:
                [
                    HistoricalDataModule,
                    HttpClientTestingModule,
                ],
            providers: [
                { provide: AppMessageService, useValue: appMessageServiceSpyObj },
            ],
        });

        fixture = TestBed.createComponent(HistoricalDataGraphComponent);
        component = fixture.debugElement.componentInstance;
    });

    it('setup', () => {
        expect(component).toBeTruthy();
    });

});
