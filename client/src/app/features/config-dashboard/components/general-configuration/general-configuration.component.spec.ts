import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralConfigurationComponent } from './general-configuration.component';

describe('GeneralConfigurationComponent', () => {
  let component: GeneralConfigurationComponent;
  let fixture: ComponentFixture<GeneralConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
