import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '../../shared.module';
import { AttributeSelectorComponent } from './attribute-selector.component';

describe('MapDashboardComponent', () => {

    let fixture: ComponentFixture<AttributeSelectorComponent>;
    let component: AttributeSelectorComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports:
                [
                    SharedModule,
                    HttpClientTestingModule,
                ],
        });

        fixture = TestBed.createComponent(AttributeSelectorComponent);
        component = fixture.debugElement.componentInstance;
        //fixture.detectChanges();
    });

    it('setup', () => {
        expect(component).toBeTruthy();
    });

});
