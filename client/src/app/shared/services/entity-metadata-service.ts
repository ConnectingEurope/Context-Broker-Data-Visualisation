import { Injectable } from '@angular/core';
import { EntityMetadata } from '../models/entity-metadata';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ModelDto } from '../models/model-dto';
import { map } from 'rxjs/operators';
import { Entity } from '../models/entity';

export interface HistoricalAttrsQuery {
    contextUrl: string;
    service: string;
    servicePath: string;
    entityId: string;
}

@Injectable({
    providedIn: 'root',
})
export class EntityMetadataService {

    private entityMetadata: EntityMetadata;

    constructor(
        private http: HttpClient,
    ) {
    }

    public getEntityMetadata(): EntityMetadata {
        return this.entityMetadata;
    }

    public setEntityMetadata(entity: Entity, modelDto: ModelDto): Observable<void> {
        this.entityMetadata = {
            id: entity.id,
            type: modelDto.type,
            data: entity,
            contextUrl: modelDto.contextUrl,
            cometUrl: modelDto.cometUrl,
            service: modelDto.service,
            servicePath: modelDto.servicePath,
            favAttr: modelDto.favAttr,
        };
        return this.getHistoricalAttrs().pipe(map(attrs => {
            this.entityMetadata.attrs = attrs.filter(a => Object.keys(entity).indexOf(a) >= 0);
            sessionStorage.setItem('entityMetadata', JSON.stringify(this.entityMetadata));
            return;
        }));
    }

    private getHistoricalAttrs(): Observable<string[]> {
        const body: HistoricalAttrsQuery = {
            contextUrl: this.entityMetadata.contextUrl,
            service: this.entityMetadata.service,
            servicePath: this.entityMetadata.servicePath,
            entityId: this.entityMetadata.id,
        };
        return this.http.post<string[]>('/server/subscriptions/attrs', body);
    }

}
