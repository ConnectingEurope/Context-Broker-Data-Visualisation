import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalConfigurationComponent } from './historical-configuration.component';

describe('HistoricalConfigurationComponent', () => {
  let component: HistoricalConfigurationComponent;
  let fixture: ComponentFixture<HistoricalConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HistoricalConfigurationComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricalConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
