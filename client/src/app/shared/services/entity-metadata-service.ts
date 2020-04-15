import { Injectable } from '@angular/core';
import { EntityMetadata } from '../models/entity-metadata';

@Injectable({
    providedIn: 'root',
})
export class EntityMetadataService {

    private entityMetadata: EntityMetadata;

    public getEntityMetadata(): EntityMetadata {
        return this.entityMetadata;
    }

    public setEntityMetadata(eM: EntityMetadata): void {
        this.entityMetadata = eM;
    }

}
