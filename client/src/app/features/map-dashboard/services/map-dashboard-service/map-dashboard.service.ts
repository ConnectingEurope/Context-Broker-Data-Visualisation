import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AirQualityObserved } from '../../../../shared/data-models/fiware/specific/air-quality-observed';
import { ModelDto } from 'src/app/shared/misc/model-dto';
import { Entity } from 'src/app/shared/data-models/fiware/entity';

@Injectable({
  providedIn: 'root',
})
export class MapDashboardService {

  private samples: number = 500;

  constructor(private http: HttpClient) { }

  public getAirQualityObservedEntities(): Observable<AirQualityObserved[]> {
    return this.http.get<AirQualityObserved[]>('/server/air-quality-observed');
  }

  public getAllEntities(): Observable<ModelDto[]> {
    return of([
      { key: 'airQualityObserved', parentKey: 'environment', data: this.generateData() },
      { key: 'offStreetParking', parentKey: 'transport', data: this.generateData() },
    ]);
  }

  private generateData(): Entity[] {
    let count: number = this.samples;
    const data: Entity[] = [];
    while (count > 0) {
      data.push({ location: this.generateRandomLatLon() });
      count--;
    }
    return data;
  }

  private generateRandomLatLon(): { coordinates: number[] } {
    const lat: number = this.randomNumberFromInterval(37.890676, 42.897983);
    const lon: number = this.randomNumberFromInterval(-8.246180, -1.150096);
    return { coordinates: [lat, lon] };
  }

  private randomNumberFromInterval(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

}
