import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PopupComponent } from './popup.component';
import { SharedModule } from '../../shared.module';

describe('MapDashboardComponent', () => {

    let fixture: ComponentFixture<PopupComponent>;
    let component: PopupComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports:
                [
                    SharedModule,
                    HttpClientTestingModule,
                ],
        });

        fixture = TestBed.createComponent(PopupComponent);
        component = fixture.debugElement.componentInstance;
        //fixture.detectChanges();
    });

    it('setup', () => {
        expect(component).toBeTruthy();
    });

});
