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

    constructor(
        private entityMetadataService: EntityMetadataService,
    ) { }

    public ngOnInit(): void {
        const entityMetadata: EntityMetadata = this.entityMetadataService.getEntityMetadata();
        console.log(entityMetadata);
    }

}
