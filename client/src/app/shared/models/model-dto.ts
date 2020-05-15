import { Entity } from './entity';

export interface ModelDto {
    type: string;
    favAttr: string;
    selectedAttrs: string[];
    contextUrl: string;
    cometUrl: string;
    service: string;
    servicePath: string;
    data: Entity[];
}
