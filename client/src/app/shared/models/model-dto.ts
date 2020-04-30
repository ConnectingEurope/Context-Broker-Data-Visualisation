import { Entity } from './entity';

export interface ModelDto {
    type: string;
    favAttr: string;
    contextUrl: string;
    cometUrl: string;
    service: string;
    servicePath: string;
    data: Entity[];
}
