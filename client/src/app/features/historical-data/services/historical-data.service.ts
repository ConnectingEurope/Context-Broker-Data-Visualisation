import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Moment } from 'moment';

enum Operation {
    FIRST_N = 'first',
    LAST_N = 'last',
    AGGR = 'aggr',
}

enum AggregateMethod {
    SUM = 'sum',
    AVG = 'avg',
    MIN = 'min',
    MAX = 'max',
}

enum AggregatePeriod {
    SECOND = 'second',
    MINUTE = 'minute',
    HOUR = 'hour',
    DAY = 'day',
}

interface RawParameters {
    lastN?: number;
    hLimit?: number;
    hOffset?: number;
    dateFrom?: string;
    dateTo?: string;
    fileType?: string;
    count?: boolean;
}

interface AggregatedParameters {
    aggrMethod?: AggregateMethod;
    aggrPeriod?: AggregatePeriod;
    dateFrom?: string;
    dateTo?: string;
}

type OperationParameters = RawParameters | AggregatedParameters;

export interface HistoricalQuery {
    cometUrl?: string;
    service?: string;
    servicePath?: string;
    type?: string;
    id?: string;
    attr?: string;
    operation?: Operation;
    operationParameters?: OperationParameters;
}

@Injectable({
    providedIn: 'root',
})
export class MapDashboardService {

    constructor(private http: HttpClient) { }

    public getFirstN(entityMetadata: any, attr: string, opParams: RawParameters): Observable<any> {
        const body: HistoricalQuery = this.getBaseQuery(entityMetadata, attr);
        body.operation = Operation.FIRST_N;
        body.operationParameters = opParams;
        return this.getHistorical(body);
    }

    public getLastN(entityMetadata: any, attr: string, opParams: RawParameters): Observable<any> {
        const body: HistoricalQuery = this.getBaseQuery(entityMetadata, attr);
        body.operation = Operation.LAST_N;
        body.operationParameters = opParams;
        return this.getHistorical(body);
    }

    public getAggregate(entityMetadata: any, attr: string, opParams: AggregatedParameters): Observable<any> {
        const body: HistoricalQuery = this.getBaseQuery(entityMetadata, attr);
        body.operation = Operation.AGGR;
        body.operationParameters = opParams;
        return this.getHistorical(body);
    }

    private getBaseQuery(entityMetadata: any, attribute: string): HistoricalQuery {
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
