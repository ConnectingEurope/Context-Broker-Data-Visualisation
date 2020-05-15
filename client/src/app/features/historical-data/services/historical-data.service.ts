import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EntityMetadata } from 'src/app/shared/models/entity-metadata';
import { HistoricalQuery, RawParameters, AggregatedParameters } from '../models/historical-data-objects';

@Injectable({
    providedIn: 'root',
})
export class HistoricalDataService {

    constructor(private http: HttpClient) { }

    public getRawCsv(entityMetadata: EntityMetadata, attr: string, opParams: RawParameters): Observable<any> {
        const body: HistoricalQuery = this.getBaseQuery(entityMetadata, attr);
        body.operationParameters = opParams;
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.set('Avoid-Http-Interceptor', 'true');
        return this.http.post<any>('/server/historic/raw', body, { headers });
    }

    public getRaw(entityMetadata: EntityMetadata, attr: string, opParams: RawParameters, headers?: HttpHeaders): Observable<any> {
        const body: HistoricalQuery = this.getBaseQuery(entityMetadata, attr);
        body.operationParameters = opParams;
        return this.http.post<any>('/server/historic/raw', body);
    }

    public getAggregate(entityMetadata: EntityMetadata, attr: string, opParams: AggregatedParameters): Observable<any> {
        const body: HistoricalQuery = this.getBaseQuery(entityMetadata, attr);
        body.operationParameters = opParams;
        return this.http.post<any>('/server/historic/aggr', body);
    }

    private getBaseQuery(entityMetadata: EntityMetadata, attribute: string): HistoricalQuery {
        return {
            cometUrl: entityMetadata.cometUrl,
            service: entityMetadata.service,
            servicePath: entityMetadata.servicePath,
            type: entityMetadata.type,
            id: entityMetadata.id,
            attr: attribute,
        };
    }

}
