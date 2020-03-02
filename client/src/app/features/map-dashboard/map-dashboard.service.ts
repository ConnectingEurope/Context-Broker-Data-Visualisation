import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AirQualityObserved } from '../../shared/data-models/air-quality-observed';

@Injectable({
  providedIn: 'root',
})
export class MapDashboardService {

  constructor(private http: HttpClient) {

  }

  public getAirQualityObservedEntities(): Observable<AirQualityObserved[]> {
    return this.http.get<AirQualityObserved[]>('/server/air-quality-observed');
  }

}
