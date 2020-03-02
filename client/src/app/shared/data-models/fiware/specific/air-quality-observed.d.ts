import { Entity } from '../entity';
import { Moment } from 'moment';

export interface AirQualityObserved extends Entity {
    dateObserved?: Moment;
    NO?: number;
}
