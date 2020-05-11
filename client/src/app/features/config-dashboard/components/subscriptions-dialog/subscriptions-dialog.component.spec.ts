import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigDashboardModule } from '../../config-dashboard.module';
import { SubscriptionsDialogComponent } from './subscriptions-dialog.component';

describe('SubscriptionsDialogComponent', () => {

    let fixture: ComponentFixture<SubscriptionsDialogComponent>;
    let component: SubscriptionsDialogComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports:
                [
                    ConfigDashboardModule,
                    HttpClientTestingModule,
                ],
        });

        fixture = TestBed.createComponent(SubscriptionsDialogComponent);
        component = fixture.debugElement.componentInstance;
    });

    it('setup', () => {
        expect(component).toBeTruthy();
    });

});
