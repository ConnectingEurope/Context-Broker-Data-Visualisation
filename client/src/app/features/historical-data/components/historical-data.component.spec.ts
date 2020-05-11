import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HistoricalDataComponent } from './historical-data.component';
import { HistoricalDataModule } from '../historical-data.module';
import { AppMessageService } from 'src/app/shared/services/app-message-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('HistoricalDataComponent', () => {

    let fixture: ComponentFixture<HistoricalDataComponent>;
    let component: HistoricalDataComponent;

    beforeEach(() => {
        const appMessageServiceSpyObj: any = jasmine.createSpyObj('AppMessageService', ['add']);

        TestBed.configureTestingModule({
            imports:
                [
                    HistoricalDataModule,
                    HttpClientTestingModule,
                    BrowserAnimationsModule,
                ],
            providers: [
                { provide: AppMessageService, useValue: appMessageServiceSpyObj },
            ],
        });

        fixture = TestBed.createComponent(HistoricalDataComponent);
        component = fixture.debugElement.componentInstance;
    });

    it('setup', () => {
        expect(component).toBeTruthy();
    });

});
