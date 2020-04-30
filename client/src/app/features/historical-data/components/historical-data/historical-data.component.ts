import { Component, OnInit, ViewChildren } from '@angular/core';
import { Route } from '@angular/router';
import { EntityMetadata } from 'src/app/shared/models/entity-metadata';
import { EntityMetadataService } from 'src/app/shared/services/entity-metadata-service';
import { BaseComponent } from 'src/app/shared/misc/base.component';
import { AccordionTab, Accordion } from 'primeng/accordion/accordion';

@Component({
    selector: 'app-historical-data',
    templateUrl: './historical-data.component.html',
    styleUrls: ['./historical-data.component.scss'],
})
export class HistoricalDataComponent extends BaseComponent implements OnInit {

    public entityMetadata: EntityMetadata;

    constructor(
        private entityMetadataService: EntityMetadataService,
    ) {
        super();
    }

    public ngOnInit(): void {
        this.entityMetadata = JSON.parse(localStorage.getItem('entityMetadata'));
    }

}
