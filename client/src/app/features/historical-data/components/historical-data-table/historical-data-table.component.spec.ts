import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HistoricalDataTableComponent } from './historical-data-table.component';
import { HistoricalDataModule } from '../../historical-data.module';
import { AppMessageService } from 'src/app/shared/services/app-message-service';

describe('HistoricalDataTableComponent', () => {

    let fixture: ComponentFixture<HistoricalDataTableComponent>;
    let component: HistoricalDataTableComponent;

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

        fixture = TestBed.createComponent(HistoricalDataTableComponent);
        component = fixture.debugElement.componentInstance;
    });

    it('setup', () => {
        expect(component).toBeTruthy();
    });

});
