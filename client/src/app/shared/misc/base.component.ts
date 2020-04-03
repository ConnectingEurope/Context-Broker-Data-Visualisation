import { OnDestroy, Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export abstract class BaseComponent implements OnDestroy {

    protected destroy$: Subject<boolean> = new Subject<boolean>();

    public ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

}
