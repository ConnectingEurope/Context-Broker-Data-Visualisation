import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ModelDto } from 'src/app/shared/models/model-dto';

@Injectable({
    providedIn: 'root',
})
export class MapDashboardService {

    constructor(
        private http: HttpClient,
    ) { }

    public getEntity(model: ModelDto, entity: any): Observable<any> {
        const body: any = {
            url: model.contextUrl,
            service: model.service,
            servicePath: model.servicePath,
            type: model.type,
            id: entity.id,
        };

        return this.http.post<any>('/server/entity', body);
    }

    public getAllEntities(avoidHttpInterceptor?: boolean): Observable<ModelDto[]> {
        let headers: HttpHeaders = new HttpHeaders();
        if (avoidHttpInterceptor) {
            headers = headers.set('Avoid-Http-Interceptor', 'true');
        }
        return this.http.get<ModelDto[]>('/server/all', { headers });
    }

    public getAllEntitiesForLayers(): Observable<any[]> {
        return this.http.get<any[]>('/server/entities/all');
    }

}
