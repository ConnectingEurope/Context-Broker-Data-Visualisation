import { EntityMetadataService } from './../../../../../shared/services/entity-metadata-service';
import { HistoricalDataService } from './../../../services/historical-data.service';
import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from 'src/app/shared/misc/base.component';
import { takeUntil } from 'rxjs/operators';
import { EntityMetadata } from 'src/app/shared/models/entity-metadata';
import { RawParameters } from '../../../models/historical-data-objects';

@Component({
    selector: 'app-historical-data-table',
    templateUrl: './historical-data-table.component.html',
    styleUrls: ['./historical-data-table.component.scss'],
})
export class HistoricalDataTableComponent extends BaseComponent implements OnInit {

    protected titles: string[] = ['NO', 'NO2', 'O3'];
    protected content: any = {};
    protected data: any[] = [];
    private hLimit: number = 10;
    private time: string = 'time';

    constructor(
        private historicalDataService: HistoricalDataService,
        private entityMetadataService: EntityMetadataService,
    ) {
        super();
    }

    public ngOnInit(): void {
        const entityMetadata: EntityMetadata = this.entityMetadataService.getEntityMetadata();
        if (entityMetadata) {
            this.titles.forEach((column) => {
                this.getContent(entityMetadata, column);
            });
        }
    }

    private getContent(entityMetadata: EntityMetadata, column: string): void {
        this.content[column] = [];
        const rawParameters: RawParameters = {
            hLimit: this.hLimit,
            hOffset: 30,
            count: true,
        };
        this.historicalDataService.getRaw(entityMetadata, column, rawParameters).pipe(takeUntil(this.destroy$)).subscribe(
            (res: any) => {
                this.content[column] = res.body.contextResponses[0].contextElement.attributes[0];
                this.content[column].values.forEach((element, index) => {
                    if (!this.data[index]) {
                        this.data[index] = {};
                        this.data[index][this.time] = element.recvTime;
                    }
                    this.data[index][column] = element;
                });
            },
            err => {
                console.log(err);
            });
    }

}
