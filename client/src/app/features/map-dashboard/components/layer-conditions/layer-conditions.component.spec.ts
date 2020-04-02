import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerConditionsComponent } from './layer-conditions.component';

describe('LayerConditionsComponent', () => {
  let component: LayerConditionsComponent;
  let fixture: ComponentFixture<LayerConditionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LayerConditionsComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
