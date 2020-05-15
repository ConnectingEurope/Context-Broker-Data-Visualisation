import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParameterCodec, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ModelDto } from 'src/app/shared/models/model-dto';
import { Entity } from 'src/app/shared/models/entity';
import { EntityMetadata } from 'src/app/shared/models/entity-metadata';

@Injectable({
    providedIn: 'root',
})
export class MapDashboardService {

    constructor(
        private http: HttpClient,
    ) { }

    public getEntity(model: ModelDto, entity: Entity): Observable<Entity[]> {
        const body: any = {
            url: model.contextUrl,
            service: model.service,
            servicePath: model.servicePath,
            type: model.type,
            id: entity.id,
        };

        return this.http.post<Entity[]>('/server/entities/one', body);
    }

    public getEntityForPopup(model: ModelDto, entity: Entity): Observable<Entity[]> {
        const body: any = {
            url: model.contextUrl,
            service: model.service,
            servicePath: model.servicePath,
            type: model.type,
            id: entity.id,
            attrs: model.selectedAttrs,
        };

        return this.http.post<Entity[]>('/server/entities/one', body);
    }

    public getEntitiesForUpdating(model: ModelDto, filteredAttrs: string[], avoidHttpInterceptor?: boolean): Observable<Entity[]> {
        let headers: HttpHeaders = new HttpHeaders();
        if (avoidHttpInterceptor) { headers = headers.set('Avoid-Http-Interceptor', 'true'); }
        const body: any = {
            url: model.contextUrl,
            service: model.service,
            servicePath: model.servicePath,
            type: model.type,
            favAttr: model.favAttr,
            attrs: filteredAttrs,
        };

        return this.http.post<Entity[]>('/server/entities/one/simplified', body, { headers });
    }

    public getEntitiesData(avoidHttpInterceptor?: boolean): Observable<ModelDto[]> {
        let headers: HttpHeaders = new HttpHeaders();
        if (avoidHttpInterceptor) { headers = headers.set('Avoid-Http-Interceptor', 'true'); }
        return this.http.get<ModelDto[]>('/server/entities/data', { headers });
    }

    public getAllEntitiesForLayers(): Observable<any[]> {
        return this.http.get<any[]>('/server/configuration/entities');
    }

}
