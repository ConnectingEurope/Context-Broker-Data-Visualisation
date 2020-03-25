import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContextBrokerConfiguration } from '../../models/context-broker-configuration';
import { EntityDto } from '../../models/entity-dto';

@Injectable({
  providedIn: 'root',
})
export class ConfigDashboardService {

  constructor(private http: HttpClient) { }

  public checkBrokerHealth(url: string): Observable<boolean> {
    return this.checkHealth(url, '/server/check-broker');
  }

  public checkCygnusHealth(url: string): Observable<boolean> {
    return this.checkHealth(url, '/server/check-cygnus');
  }

  public checkCometHealth(url: string): Observable<boolean> {
    return this.checkHealth(url, '/server/check-comet');
  }

  public getEntitiesFromService(url: string, service?: string, servicePath?: string): Observable<EntityDto[]> {
    let parameters: HttpParams = new HttpParams();
    parameters = parameters.append('url', url);
    if (service && servicePath) {
      parameters = parameters.append('service', service);
      parameters = parameters.append('servicePath', servicePath);
    }

    return this.http.get<EntityDto[]>('/server/entities', { params: parameters });
  }

  public getConfiguration(): Observable<ContextBrokerConfiguration[]> {
    return this.http.get<ContextBrokerConfiguration[]>('/server/config');
  }

  public postConfiguration(config: ContextBrokerConfiguration[]): Observable<void> {
    return this.http.post<void>('/server/config', config);
  }

  private checkHealth(url: string, api: string): Observable<boolean> {
    let parameters: HttpParams = new HttpParams();
    parameters = parameters.append('url', url);

    return this.http.get<boolean>(api, { params: parameters });
  }

}
