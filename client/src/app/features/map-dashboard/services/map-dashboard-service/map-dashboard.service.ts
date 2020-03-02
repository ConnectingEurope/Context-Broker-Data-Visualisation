import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AirQualityObserved } from '../../../../shared/data-models/air-quality-observed';

@Injectable({
  providedIn: 'root',
})
export class MapDashboardService {

  constructor(private http: HttpClient) {

  }

  public getAirQualityObservedEntities(): Observable<AirQualityObserved[]> {
    return this.http.get<AirQualityObserved[]>('/server/air-quality-observed');
  }

  public getAllEntities(): Observable<any[]> {
    return of([
      {
        modelKey: 'airQualityObserved', parentKey: 'environment', data: [
          { location: { coordinates: [42.897983, -8.246180] }, NO: 10 },
        ] as AirQualityObserved[],
      },
    ]);
  }

}
