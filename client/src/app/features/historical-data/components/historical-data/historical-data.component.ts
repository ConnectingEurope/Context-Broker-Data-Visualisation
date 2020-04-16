import { Component, OnInit } from '@angular/core';
import { Route } from '@angular/router';
import { EntityMetadata } from 'src/app/shared/models/entity-metadata';
import { EntityMetadataService } from 'src/app/shared/services/entity-metadata-service';

@Component({
    selector: 'app-historical-data',
    templateUrl: './historical-data.component.html',
    styleUrls: ['./historical-data.component.scss'],
})
export class HistoricalDataComponent implements OnInit {

    protected entityMetadata: EntityMetadata;

    constructor(
        private entityMetadataService: EntityMetadataService,
    ) { }

    public ngOnInit(): void {
        // this.entityMetadata = this.entityMetadataService.getEntityMetadata();
        this.entityMetadata = JSON.parse(localStorage.getItem('entityMetadata'));
        console.log(this.entityMetadata);
    }

}
