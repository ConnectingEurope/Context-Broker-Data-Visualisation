import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalDataGraphComponent } from './historical-data-graph.component';

describe('HistoricalDataTableComponent', () => {
    let component: HistoricalDataTableComponent;
    let fixture: ComponentFixture<HistoricalDataTableComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HistoricalDataTableComponent],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HistoricalDataTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
