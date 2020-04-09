import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ModelDto } from 'src/app/shared/models/model-dto';

@Injectable({
    providedIn: 'root',
})
export class MapDashboardService {

    constructor(private http: HttpClient) { }

    public getAllEntities(): Observable<ModelDto[]> {
        return this.http.get<ModelDto[]>('/server/all');
    }

    public getAllEntitiesForLayers(): Observable<any[]> {
        return this.http.get<any[]>('/server/entities/all');
    }

}
