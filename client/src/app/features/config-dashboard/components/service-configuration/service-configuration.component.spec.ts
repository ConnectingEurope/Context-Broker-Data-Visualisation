import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceConfigurationComponent } from './service-configuration.component';

describe('ServiceConfigurationComponent', () => {
  let component: ServiceConfigurationComponent;
  let fixture: ComponentFixture<ServiceConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
