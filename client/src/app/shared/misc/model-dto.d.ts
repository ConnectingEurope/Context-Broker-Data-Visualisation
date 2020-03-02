import { Entity } from "../data-models/fiware/entity";

export interface ModelDto {
    key: string;
    parentKey: string;
    data: Entity[];
}
