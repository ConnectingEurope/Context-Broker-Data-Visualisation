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

    // public getEntityForUpdating(entityMetadata: EntityMetadata): Observable<Entity[]> {
    //     const body: any = {
    //         url: entityMetadata.contextUrl,
    //         service: entityMetadata.service,
    //         servicePath: entityMetadata.servicePath,
    //         type: entityMetadata.type,
    //         id: entityMetadata.id,
    //     };

    //     return this.http.post<Entity[]>('/server/entities/one/simplified', body);
    // }

    public getEntitiesForUpdating(model: ModelDto): Observable<Entity[]> {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.set('Avoid-Http-Interceptor', 'true');
        const body: any = {
            url: model.contextUrl,
            service: model.service,
            servicePath: model.servicePath,
            type: model.type,
            favAttr: model.favAttr,
        };

        return this.http.post<Entity[]>('/server/entities/one/simplified', body, { headers });
    }

    public getEntitiesData(avoidHttpInterceptor?: boolean): Observable<ModelDto[]> {
        // let params: HttpParams = new HttpParams();
        let headers: HttpHeaders = new HttpHeaders();
        // if (!firstLoad) { params = params.set('updating', 'true'); }
        if (avoidHttpInterceptor) { headers = headers.set('Avoid-Http-Interceptor', 'true'); }
        return this.http.get<ModelDto[]>('/server/entities/data', { headers });
    }

    public getAllEntitiesForLayers(): Observable<any[]> {
        return this.http.get<any[]>('/server/configuration/entities');
    }

}
