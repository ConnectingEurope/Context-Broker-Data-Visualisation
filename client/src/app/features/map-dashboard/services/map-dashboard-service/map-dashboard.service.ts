import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ModelDto } from 'src/app/shared/models/model-dto';

@Injectable({
    providedIn: 'root',
})
export class MapDashboardService {

    constructor(private http: HttpClient) { }

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
