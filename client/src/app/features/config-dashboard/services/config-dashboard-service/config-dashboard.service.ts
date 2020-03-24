import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Configuration } from '../../models/context-broker';
import { ResponseFromServer } from 'src/app/shared/models/response-from-server';

@Injectable({
  providedIn: 'root',
})
export class ConfigDashboardService {

  constructor(private http: HttpClient) { }

  public checkBrokerHealth(url: string): Observable<ResponseFromServer> {
    return this.checkHealth(url, '/server/check-broker');
  }

  public checkCygnusHealth(url: string): Observable<ResponseFromServer> {
    return this.checkHealth(url, '/server/check-cygnus');
  }

  public checkCometHealth(url: string): Observable<ResponseFromServer> {
    return this.checkHealth(url, '/server/check-comet');
  }

  public getEntitiesFromService(url: string, service?: string, servicePath?: string): Observable<ResponseFromServer> {
    let parameters: HttpParams = new HttpParams();
    parameters = parameters.append('url', url);
    parameters = parameters.append('service', service);
    parameters = parameters.append('servicePath', servicePath);

    return this.http.get<ResponseFromServer>('/server/entities', { params: parameters });
  }

  public postConfiguration(config: Configuration): Observable<ResponseFromServer> {
    return this.http.post<ResponseFromServer>('/server/config', config);
  }

  private checkHealth(url: string, api: string): Observable<ResponseFromServer> {
    let parameters: HttpParams = new HttpParams();
    parameters = parameters.append('url', url);

    return this.http.get<ResponseFromServer>(api, { params: parameters });
  }

}
