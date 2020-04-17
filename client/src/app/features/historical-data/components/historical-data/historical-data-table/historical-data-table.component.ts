import { EntityMetadataService } from './../../../../../shared/services/entity-metadata-service';
import { HistoricalDataService } from './../../../services/historical-data.service';
import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { BaseComponent } from 'src/app/shared/misc/base.component';
import { takeUntil, count } from 'rxjs/operators';
import { EntityMetadata } from 'src/app/shared/models/entity-metadata';
import { RawParameters } from '../../../models/historical-data-objects';
import { LazyLoadEvent } from 'primeng/api/public_api';

@Component({
    selector: 'app-historical-data-table',
    templateUrl: './historical-data-table.component.html',
    styleUrls: ['./historical-data-table.component.scss'],
})
export class HistoricalDataTableComponent extends BaseComponent implements OnInit {

    @Input()
    protected entityMetadata: EntityMetadata;

    protected totalRecords: number;
    protected first: number = 0;
    protected last: number = 0;
    protected content: any = {};
    protected data: any[] = [];
    protected pageReport: string = '';
    private hLimit: number = 10;
    private time: string = 'time';
    private rawParameters: RawParameters;

    constructor(
        private historicalDataService: HistoricalDataService,
    ) {
        super();
    }

    public ngOnInit(): void {
        this.rawParameters = {
            hLimit: this.hLimit,
            hOffset: this.first,
            count: true,
        };
        if (this.entityMetadata && this.entityMetadata.attrs) {
            this.getAllContent();
        }
    }

    protected onLazyLoad(event: LazyLoadEvent): void {
        const total: number = event.first + event.rows;
        this.first = event.first;
        this.last = total > this.totalRecords ? this.totalRecords : total;
        this.data = [];
        this.changeRawParameter();
        this.getAllContent();
    }

    protected getAllContent(): void {
        this.entityMetadata.attrs.forEach((column) => {
            this.getContent(this.entityMetadata, column);
        });
    }

    protected changeRawParameter(): void {
        this.rawParameters = {
            hLimit: this.hLimit,
            hOffset: this.first,
            count: true,
        };
    }

    private getContent(entityMetadata: EntityMetadata, column: string): void {
        this.content[column] = [];
        this.historicalDataService.getRaw(entityMetadata, column, this.rawParameters).pipe(takeUntil(this.destroy$)).subscribe(
            (res: any) => {
                this.content[column] = res.body.contextResponses[0].contextElement.attributes[0];
                const totalCount: string = 'fiware-total-count';
                this.totalRecords = res.headers[totalCount];
                this.content[column].values.forEach((element, index) => {
                    if (!this.data[index]) {
                        this.data[index] = {};
                        // RESET DATE
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
