import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EntityMetadata } from 'src/app/shared/models/entity-metadata';
import { HistoricalQuery, RawParameters, AggregatedParameters } from '../models/historical-data-form';

@Injectable({
    providedIn: 'root',
})
export class HistoricalDataService {

    constructor(private http: HttpClient) { }

    public getRaw(entityMetadata: EntityMetadata, attr: string, opParams: RawParameters): Observable<any> {
        const body: HistoricalQuery = this.getBaseQuery(entityMetadata, attr);
        body.operationParameters = opParams;
        opParams.count = true;
        return this.getHistorical(body);
    }
    public getAggregate(entityMetadata: EntityMetadata, attr: string, opParams: AggregatedParameters): Observable<any> {
        const body: HistoricalQuery = this.getBaseQuery(entityMetadata, attr);
        body.operationParameters = opParams;
        return this.getHistorical(body);
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

    private getHistorical(body: HistoricalQuery): Observable<any> {
        return this.http.post<Observable<any>>('/server/historical-data', body);
    }

}
