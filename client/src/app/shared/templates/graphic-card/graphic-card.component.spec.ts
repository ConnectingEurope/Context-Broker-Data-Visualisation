import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '../../shared.module';
import { GraphicCardComponent } from './graphic-card.component';

describe('GraphicCardComponent', () => {

    let fixture: ComponentFixture<GraphicCardComponent>;
    let component: GraphicCardComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports:
                [
                    SharedModule,
                    HttpClientTestingModule,
                ],
        });

        fixture = TestBed.createComponent(GraphicCardComponent);
        component = fixture.debugElement.componentInstance;
    });

    it('setup', () => {
        expect(component).toBeTruthy();
    });

});
