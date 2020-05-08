import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ModelDto } from 'src/app/shared/models/model-dto';
import { Entity } from 'src/app/shared/models/entity';

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

        return this.http.post<Entity[]>('/server/entity', body);
    }

    public getEntitiesData(avoidHttpInterceptor?: boolean): Observable<ModelDto[]> {
        let headers: HttpHeaders = new HttpHeaders();
        if (avoidHttpInterceptor) { headers = headers.set('Avoid-Http-Interceptor', 'true'); }
        return this.http.get<ModelDto[]>('/server/entitiesData', { headers });
    }

    public getAllEntitiesForLayers(): Observable<any[]> {
        return this.http.get<any[]>('/server/entities/all');
    }

}
