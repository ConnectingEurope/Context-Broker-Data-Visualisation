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

  public getEntitiesFromService(url: string, port: string, service: string, servicePath: string): Observable<any> {
    let parameters: HttpParams = new HttpParams();
    parameters = parameters.append('url', url);
    parameters = parameters.append('port', port);
    parameters = parameters.append('service', service);
    parameters = parameters.append('servicePath', servicePath);

    return this.http.get('/server/entities', { params: parameters });
  }

  public postConfiguration(config: any): Observable<any> {
    return this.http.post('/server/config', config);
  }

}
