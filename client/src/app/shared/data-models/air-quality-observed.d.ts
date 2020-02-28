import { Entity } from "./entity";
import { Moment } from 'moment';

export interface AirQualityObserved extends Entity {
    latitude: number;
    longitude: number;
    TimeInstant: Moment;
    NO: string;
    NO2: string;
    O3: string;
    SO2: string;
    CO: string;
    C6H6: string;
    PM10: string;
    AQI: string;
    'PM2.5': string;
}
