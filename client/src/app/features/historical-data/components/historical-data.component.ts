import { Component, OnInit } from '@angular/core';
import { EntityMetadata } from 'src/app/shared/models/entity-metadata';

@Component({
    selector: 'app-historical-data',
    templateUrl: './historical-data.component.html',
    styleUrls: ['./historical-data.component.scss'],
})
export class HistoricalDataComponent implements OnInit {

    public entityMetadata: EntityMetadata;
    public displayHistoricalData: boolean;

    public ngOnInit(): void {
        this.entityMetadata = JSON.parse(sessionStorage.getItem('entityMetadata'));
        this.displayHistoricalData = this.entityMetadata.attrs.length > 0;
    }

}
