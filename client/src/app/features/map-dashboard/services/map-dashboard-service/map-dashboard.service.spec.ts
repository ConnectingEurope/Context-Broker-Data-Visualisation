import { TestBed } from '@angular/core/testing';

import { MapDashboardService } from './map-dashboard.service';

describe('MapDashboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MapDashboardService = TestBed.get(MapDashboardService);
    expect(service).toBeTruthy();
  });
});
