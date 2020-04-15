import { Injectable } from '@angular/core';
import { EntityMetadata } from '../models/entity-metadata';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ModelDto } from '../models/model-dto';
import { map } from 'rxjs/operators';

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

    constructor(private http: HttpClient) {
    }

    public getEntityMetadata(): EntityMetadata {
        return this.entityMetadata;
    }

    public setEntityMetadata(entity: any, modelDto: ModelDto): Observable<void> {
        this.entityMetadata = {
            id: entity.id,
            type: modelDto.type,
            contextUrl: modelDto.contextUrl,
            cometUrl: modelDto.cometUrl,
            service: modelDto.service,
            servicePath: modelDto.servicePath,
        };
        return this.getHistoricalAttrs().pipe(map(attrs => {
            this.entityMetadata.attrs = attrs;
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
        return this.http.post<string[]>('/server/historical-data/attrs', body);
    }

}
