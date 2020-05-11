import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AccordionTabHeaderComponent } from './accordion-tab-header.component';
import { SharedModule } from '../../shared.module';

describe('MapDashboardComponent', () => {

    let fixture: ComponentFixture<AccordionTabHeaderComponent>;
    let component: AccordionTabHeaderComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports:
                [
                    SharedModule,
                    HttpClientTestingModule,
                ],
        });

        fixture = TestBed.createComponent(AccordionTabHeaderComponent);
        component = fixture.debugElement.componentInstance;
        //fixture.detectChanges();
    });

    it('setup', () => {
        expect(component).toBeTruthy();
    });

});
