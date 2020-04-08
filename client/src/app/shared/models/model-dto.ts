import { Entity } from './entity';

export interface ModelDto {
    type: string;
    cometUrl: string;
    data: Entity[];
}
