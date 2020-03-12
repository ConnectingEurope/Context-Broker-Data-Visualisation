import { Entity } from "../data-models/fiware/entity";

export interface ModelDto {
    type: string;
    data: Entity[];
}
