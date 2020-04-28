import { HistoricalDataService } from './../../../services/historical-data.service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { BaseComponent } from 'src/app/shared/misc/base.component';
import { EntityMetadata } from 'src/app/shared/models/entity-metadata';
import { RawParameters } from '../../../models/historical-data-objects';
import { LazyLoadEvent } from 'primeng/api/public_api';
import { Observable, combineLatest } from 'rxjs';
import { Table } from 'primeng/table';
import { saveAs } from 'file-saver';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-historical-data-table',
    templateUrl: './historical-data-table.component.html',
    styleUrls: ['./historical-data-table.component.scss'],
})
export class HistoricalDataTableComponent extends BaseComponent implements OnInit {

    @Input() public entityMetadata: EntityMetadata;

    public displayModal: boolean;
    public progressBarValue: number = 0;
    public titlesCsv: string[] = [];
    public dataCsv: any[] = [];
    public contentCsv: any = {};
    public totalCsv: number = 0;
    public dateFrom: Date;
    public dateTo: Date;
    public titles: string[] = [];
    public totalRecords: number;
    public first: number = 0;
    public last: number = 0;
    public content: any = {};
    public data: any[] = [];
    public pageReport: string = '';
    public loading: boolean = true;
    public performSearch: boolean;
    public hLimit: number = 10;
    public time: string = 'time';
    private rawParameters: RawParameters;
    private totalCount: string = 'fiware-total-count';
    @ViewChild('table', { static: true }) private table: Table;

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
    }

    public onLazyLoad(event: LazyLoadEvent): void {
        this.prepareParameters(event.first, event.rows);
    }

    public prepareParameters(first: number, rows: number): void {
        const total: number = first + rows;
        this.first = first;
        this.last = total > this.totalRecords ? this.totalRecords : total;
        this.data = [];
        this.changeRawParameter();
        if (this.entityMetadata && this.entityMetadata.attrs) {
            this.getAllContent(total);
        }
    }

    public getAllContent(total?: number): void {
        this.titles = [];
        this.loading = true;
        const combinedCalls: Observable<any>[] = this.entityMetadata.attrs.map((column) => {
            return this.historicalDataService.getRaw(this.entityMetadata, column, this.rawParameters);
        });
        combineLatest(combinedCalls).pipe(takeUntil(this.destroy$)).subscribe({
            next: (combinedResults): void => {
                combinedResults.forEach((res, i) => this.processContent(res, this.entityMetadata.attrs[i]));
            },
            complete: (): void => {
                this.last = total > this.totalRecords ? this.totalRecords : total;
                this.loading = false;
            },
        });
    }

    public changeRawParameter(): void {
        this.rawParameters = {
            hLimit: this.hLimit,
            hOffset: this.first,
            dateFrom: this.dateFrom !== null ? this.dateFrom : undefined,
            dateTo: this.dateTo !== null ? this.dateTo : undefined,
            count: true,
        };
    }

    public setPerformSearch(): void {
        this.performSearch = true;
    }

    public onDateChange(): void {
        if (this.performSearch) {
            if (this.dateFrom) {
                this.dateFrom.setSeconds(0);
                this.dateFrom.setMilliseconds(0);
            }
            if (this.dateTo) {
                this.dateTo.setSeconds(0);
                this.dateTo.setMilliseconds(0);
            }
            this.resetTable();
            this.prepareParameters(0, this.hLimit);
        }
        this.performSearch = false;
    }

    public clearDates(): void {
        this.dateFrom = undefined;
        this.dateTo = undefined;
        this.setPerformSearch();
        this.onDateChange();
    }

    public onExportToCsv(): void {
        this.displayModal = true;
        this.totalCsv = 0;
        this.progressBarValue = 0;
        this.exportToCsv(0);
    }

    private exportToCsv(offset: number): void {

        const rawParameters: RawParameters = {
            hLimit: 100,
            hOffset: offset,
            dateFrom: this.dateFrom !== null ? this.dateFrom : undefined,
            dateTo: this.dateTo !== null ? this.dateTo : undefined,
            count: true,
        };
        const combinedCalls: Observable<any>[] = this.entityMetadata.attrs.map((column) => {
            return this.historicalDataService.getRawCsv(this.entityMetadata, column, rawParameters);
        });
        combineLatest(combinedCalls).pipe(takeUntil(this.destroy$)).subscribe({
            next: (combinedResults): void => {
                combinedResults.forEach((res, i) => this.processContentCsv(res, this.entityMetadata.attrs[i], offset));
                if (this.totalCsv === 0) {
                    if (combinedResults.length > 0 && combinedResults[0].headers[this.totalCount]) {
                        this.totalCsv = combinedResults[0].headers[this.totalCount];
                    }
                }
                if (this.totalCsv > offset + 100) {
                    this.progressBarValue = Math.round((offset / this.totalCsv) * 100);
                    this.exportToCsv(offset + 100);
                } else {
                    this.titlesCsv.unshift('Timestamp');
                    let csv: string = this.titlesCsv.join(',') + '\n';
                    this.dataCsv.forEach(r => {
                        csv += Object.values(r).map((v: any, i: number) => {
                            return i === 0 ? v : (v.attrValue ? v.attrValue : '-');
                        }).join(',') + '\n';
                    });
                    const blob: Blob = new Blob([csv], { type: 'text/plain;charset=utf-8' });
                    saveAs(blob, 'historical_data_' + this.entityMetadata.id + '.csv');
                    this.displayModal = false;
                }
            },
        });
    }

    private processContentCsv(res: any, column: string, offset: number): void {
        if (res && res.headers[this.totalCount] > 0) {
            if (!this.titlesCsv.includes(column)) { this.titlesCsv.push(column); }
            this.contentCsv[column] = res.body.contextResponses[0].contextElement.attributes[0];
            this.contentCsv[column].values.forEach((element, i) => {
                const index: number = i + offset;
                if (!this.dataCsv[index]) {
                    this.dataCsv[index] = {};
                    // RESET DATE
                    this.dataCsv[index][this.time] = element.recvTime;
                }
                this.dataCsv[index][column] = element;
            });
        }
    }

    private resetTable(): void {
        this.totalRecords = undefined;
        this.table.reset();
    }

    private processContent(res: any, column: string): void {
        if (res && res.headers[this.totalCount] > 0) {
            this.totalRecords = res.headers[this.totalCount];
            // Manage last element of the table
            if (this.totalRecords < this.hLimit) {
                this.last = this.totalRecords;
            }
            if (!this.titles.includes(column)) { this.titles.push(column); }
            this.content[column] = res.body.contextResponses[0].contextElement.attributes[0];
            this.content[column].values.forEach((element, index) => {
                if (!this.data[index]) {
                    this.data[index] = {};
                    // RESET DATE
                    this.data[index][this.time] = element.recvTime;
                }
                this.data[index][column] = element;
            });
        }
    }

}
