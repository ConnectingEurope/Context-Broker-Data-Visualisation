import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

enum AggregateMethod {
    MIN = 'min',
    MAX = 'max',
    SUM = 'sum',
    SUM2 = 'sum2',
    OCCUR = 'occur',
}

enum AggregatePeriod {
    SECOND = 'second',
    MINUTE = 'minute',
    HOUR = 'hour',
    DAY = 'day',
    MONTH = 'month',
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
    operationParameters?: OperationParameters;
}

@Injectable({
    providedIn: 'root',
})
export class MapDashboardService {

    constructor(private http: HttpClient) { }

    public getRaw(entityMetadata: any, attr: string, opParams: RawParameters): Observable<any> {
        const body: HistoricalQuery = this.getBaseQuery(entityMetadata, attr);
        body.operationParameters = opParams;
        opParams.count = true;
        return this.getHistorical(body);
    }
    public getAggregate(entityMetadata: any, attr: string, opParams: AggregatedParameters): Observable<any> {
        const body: HistoricalQuery = this.getBaseQuery(entityMetadata, attr);
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
