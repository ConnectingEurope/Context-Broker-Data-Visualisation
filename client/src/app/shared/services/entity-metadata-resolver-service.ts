import { Injectable } from '@angular/core';
import {
    Router, Resolve,
    RouterStateSnapshot,
    ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { EntityMetadata } from '../models/entity-metadata';

@Injectable({
    providedIn: 'root',
})
export class EntityMetadataResolverService implements Resolve<EntityMetadata> {

    private entityMetadata: EntityMetadata;

    constructor(private router: Router) { }

    public setEntityMetadata(eM: EntityMetadata): void {
        this.entityMetadata = eM;
    }

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<EntityMetadata> | Observable<never> {
        if (this.entityMetadata) {
            return of(this.entityMetadata);
        } else {
            this.router.navigate(['/map-dashboard']);
            return EMPTY;
        }
    }
}
