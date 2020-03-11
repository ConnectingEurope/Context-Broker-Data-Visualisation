import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigDashboardService {

  constructor(private http: HttpClient) { }

  public checkContextBrokerHealth(url: string, port: string): Observable<any> {
    let parameters: HttpParams = new HttpParams();
    parameters = parameters.append('url', url);
    parameters = parameters.append('port', port);

    return this.http.get('/server/check-health', { params: parameters });
  }

}
