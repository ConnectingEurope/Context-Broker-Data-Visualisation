export interface HistoricalQuery {
    cometUrl?: string;
    service?: string;
    servicePath?: string;
    type?: string;
    id?: string;
    attr?: string;
    operationParameters?: OperationParameters;
}

export type OperationParameters = RawParameters | AggregatedParameters;
export interface RawParameters {
    lastN?: number;
    hLimit?: number;
    hOffset?: number;
    dateFrom?: Date;
    dateTo?: Date;
    fileType?: string;
    count?: boolean;
}

export interface AggregatedParameters {
    aggrMethod?: AggregateMethod;
    aggrPeriod?: AggregatePeriod;
    dateFrom?: string;
    dateTo?: string;
}

export enum AggregateMethod {
    MIN = 'min',
    MAX = 'max',
    SUM = 'sum',
    SUM2 = 'sum2',
    OCCUR = 'occur',
}

export enum AggregatePeriod {
    SECOND = 'second',
    MINUTE = 'minute',
    HOUR = 'hour',
    DAY = 'day',
    MONTH = 'month',
}
