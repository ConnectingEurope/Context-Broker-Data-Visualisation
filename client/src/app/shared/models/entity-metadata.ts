import { Entity } from './entity';

export interface EntityMetadata {
    id?: string;
    type?: string;
    data?: Entity;
    attrs?: string[];
    contextUrl?: string;
    cometUrl?: string;
    service?: string;
    servicePath?: string;
    favAttr?: string;
}
