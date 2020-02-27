import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsDashboardComponent } from './stats-dashboard.component';

describe('StatsDashboardComponent', () => {
  let component: StatsDashboardComponent;
  let fixture: ComponentFixture<StatsDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatsDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
