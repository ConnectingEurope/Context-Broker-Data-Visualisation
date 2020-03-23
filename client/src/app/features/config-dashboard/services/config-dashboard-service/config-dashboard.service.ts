import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigDashboardService {

  constructor(private http: HttpClient) { }

  public checkBrokerHealth(url: string): Observable<any> {
    return this.checkHealth(url, '/server/check-broker');
  }

  public checkCygnusHealth(url: string): Observable<any> {
    return this.checkHealth(url, '/server/check-cygnus');
  }

  public checkCometHealth(url: string): Observable<any> {
    return this.checkHealth(url, '/server/check-comet');
  }

  public getEntitiesFromService(url: string, service?: string, servicePath?: string): Observable<any> {
    let parameters: HttpParams = new HttpParams();
    parameters = parameters.append('url', url);
    parameters = parameters.append('service', service);
    parameters = parameters.append('servicePath', servicePath);

    return this.http.get('/server/entities', { params: parameters });
  }

  public postConfiguration(config: any): Observable<any> {
    return this.http.post('/server/config', config);
  }

  private checkHealth(url: string, api: string): Observable<any> {
    let parameters: HttpParams = new HttpParams();
    parameters = parameters.append('url', url);

    return this.http.get(api, { params: parameters });
  }

}
