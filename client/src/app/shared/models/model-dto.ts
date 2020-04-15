import { Entity } from './entity';

export interface ModelDto {
    type: string;
    contextUrl: string;
    cometUrl: string;
    service: string;
    servicePath: string;
    data: Entity[];
}
