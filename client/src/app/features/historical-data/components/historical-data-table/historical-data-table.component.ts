import { HistoricalDataService } from '../../services/historical-data.service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { BaseComponent } from 'src/app/shared/misc/base.component';
import { EntityMetadata } from 'src/app/shared/models/entity-metadata';
import { RawParameters } from '../../models/historical-data-objects';
import { LazyLoadEvent } from 'primeng/api';
import { Observable, combineLatest } from 'rxjs';
import { Table } from 'primeng/table';
import { saveAs } from 'file-saver';
import { takeUntil } from 'rxjs/operators';
import { AppMessageService } from 'src/app/shared/services/app-message-service';

@Component({
    selector: 'app-historical-data-table',
    templateUrl: './historical-data-table.component.html',
    styleUrls: ['./historical-data-table.component.scss'],
})
export class HistoricalDataTableComponent extends BaseComponent implements OnInit {

    @Input() public entityMetadata: EntityMetadata;

    public displayModal: boolean;
    public progressBarValue: number = 0;
    public dateFrom: Date;
    public dateTo: Date;
    public first: number = 0;
    public last: number = 0;
    public pageReport: string = '';
    public loading: boolean = true;
    public hLimit: number = 10;
    public time: string = 'time';
    public complexAttrs: string[] = [];

    public titles: string[] = [];
    public data: any[] = [];
    public content: any = {};
    public totalRecords: number;

    public titlesCsv: string[] = [];
    public dataCsv: any[] = [];
    public contentCsv: any = {};
    public totalRecordsCsv: number = 0;

    private performSearch: boolean;
    private rawParameters: RawParameters;
    private totalCountHeader: string = 'fiware-total-count';
    private defaultMaxPage: number = 100;
    private csvSep: string = ';';

    @ViewChild('table', { static: true }) private table: Table;

    constructor(
        private historicalDataService: HistoricalDataService,
        private appMessageService: AppMessageService,
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

    /*****************************************************************************
     Event functions
    *****************************************************************************/

    public onLazyLoad(event: LazyLoadEvent): void {
        this.hLimit = event.rows;
        this.prepareParameters(event.first, event.rows);
    }

    public onCalendarChange(): void {
        this.performSearch = true;
    }

    public onCalendarClose(): void {
        if (this.performSearch) {
            this.resetCalendars();
            this.resetTable();
            this.prepareParameters(0, this.hLimit);
        }
        this.performSearch = false;
    }

    public onClearDates(): void {
        this.dateFrom = undefined;
        this.dateTo = undefined;
        this.onCalendarChange();
        this.onCalendarClose();
    }

    public onExportToCsv(): void {
        this.displayModal = true;
        this.totalRecordsCsv = 0;
        this.progressBarValue = 0;
        this.exportToCsv(0);
    }

    /*****************************************************************************
     Getting data functions
    *****************************************************************************/

    private prepareParameters(first: number, rows: number): void {
        if (this.entityMetadata && this.entityMetadata.attrs) {
            const total: number = first + rows;
            this.first = first;
            this.last = total > this.totalRecords ? this.totalRecords : total;
            this.data = [];
            this.changeRawParameter();
            this.getRawData(total);
        }
    }

    private changeRawParameter(): void {
        this.rawParameters = {
            hLimit: this.hLimit,
            hOffset: this.first,
            dateFrom: this.dateFrom !== null ? this.dateFrom : undefined,
            dateTo: this.dateTo !== null ? this.dateTo : undefined,
            count: true,
        };
    }

    private getRawData(total?: number): void {
        this.loading = true;
        this.titles = [];
        const combinedCalls: Observable<any>[] = this.entityMetadata.attrs.map((column) => {
            return this.historicalDataService.getRaw(this.entityMetadata, column, this.rawParameters);
        });
        this.launchRequests(combinedCalls, total);
    }

    private launchRequests(combinedCalls: Observable<any>[], total: number): void {
        combineLatest(combinedCalls).pipe(takeUntil(this.destroy$)).subscribe({
            next: (combinedResults): void => {
                combinedResults.forEach((data, i) => this.processData(data, this.entityMetadata.attrs[i]));
            },
            error: (err): void => {
                this.appMessageService.add({ severity: 'error', summary: 'Something went wrong getting raw data' });
            },
            complete: (): void => {
                this.last = total > this.totalRecords ? this.totalRecords : total;
                setTimeout(() => this.loading = false);
            },
        });
    }

    private processData(data: any, column: string): void {
        if (data && data.headers[this.totalCountHeader] > 0) {
            if (!this.checkComplexObject(data)) {
                this.totalRecords = data.headers[this.totalCountHeader];
                if (this.totalRecords < this.hLimit) { this.last = this.totalRecords; }
                if (!this.titles.includes(column)) { this.titles.push(column); }
                this.content[column] = data.body.contextResponses[0].contextElement.attributes[0];
                this.processValues(column);
            } else {
                this.complexAttrs.push(column);
            }
        }
    }

    private checkComplexObject(data: any): boolean {
        return data.body.contextResponses[0].contextElement.attributes[0].values.some(v => {
            return v.attrValue.startsWith('[') || v.attrValue.startsWith('{');
        });
    }

    private processValues(column: string): void {
        this.content[column].values.forEach((element, index) => {
            if (!this.data[index]) {
                this.data[index] = {};
                this.data[index][this.time] = element.recvTime;
            }
            this.data[index][column] = element;
        });
    }

    /*****************************************************************************
     Getting CSV data functions
    *****************************************************************************/

    private getRawCsvParameters(offset: number): RawParameters {
        return {
            hLimit: this.defaultMaxPage,
            hOffset: offset,
            dateFrom: this.dateFrom !== null ? this.dateFrom : undefined,
            dateTo: this.dateTo !== null ? this.dateTo : undefined,
            count: true,
        };
    }

    private exportToCsv(offset: number): void {
        const rawParameters: RawParameters = this.getRawCsvParameters(offset);
        const combinedCalls: Observable<any>[] = this.entityMetadata.attrs.map((column) => {
            return this.historicalDataService.getRawCsv(this.entityMetadata, column, rawParameters);
        });
        this.launchCsvRequests(combinedCalls, offset);
    }

    private launchCsvRequests(combinedCalls: Observable<any>[], offset: number): void {
        combineLatest(combinedCalls).pipe(takeUntil(this.destroy$)).subscribe({
            next: (combinedResults): void => {
                combinedResults.forEach((res, i) => this.processContentCsv(res, this.entityMetadata.attrs[i], offset));
                if (this.totalRecordsCsv === 0) { this.storeTotalRecordsCsv(combinedResults); }
                if (this.totalRecordsCsv > offset + this.defaultMaxPage) {
                    this.requestFollowingResults(offset);
                } else {
                    this.exportResults();
                }
            },
            error: (err): void => {
                this.appMessageService.add({ severity: 'error', summary: 'Something went wrong getting CSV data' });
            },
        });
    }

    private processContentCsv(res: any, column: string, offset: number): void {
        if (res && res.headers[this.totalCountHeader] > 0) {
            if (!this.titlesCsv.includes(column)) { this.titlesCsv.push(column); }
            this.contentCsv[column] = res.body.contextResponses[0].contextElement.attributes[0];
            this.processCsvValues(column, offset);
        }
    }

    private processCsvValues(column: string, offset: number): void {
        this.contentCsv[column].values.forEach((element, i) => {
            const index: number = i + offset;
            if (!this.dataCsv[index]) {
                this.dataCsv[index] = {};
                this.dataCsv[index][this.time] = element.recvTime;
            }
            this.dataCsv[index][column] = element;
        });
    }

    private storeTotalRecordsCsv(combinedResults: any[]): void {
        if (combinedResults.length > 0 && combinedResults[0].headers[this.totalCountHeader]) {
            this.totalRecordsCsv = combinedResults[0].headers[this.totalCountHeader];
        }
    }

    private requestFollowingResults(offset: number): void {
        this.progressBarValue = Math.round((offset / this.totalRecordsCsv) * this.defaultMaxPage);
        this.exportToCsv(offset + this.defaultMaxPage);
    }

    private exportResults(): void {
        this.titlesCsv.unshift('Timestamp');
        const csv: string = this.createCsv();
        const blob: Blob = new Blob([csv], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, 'historical_data_' + this.entityMetadata.id + '.csv');
        this.displayModal = false;
    }

    private createCsv(): string {
        let csv: string = this.titlesCsv.join(this.csvSep) + '\n';

        this.dataCsv.forEach(r => {
            csv += Object.values(r).map((v: any, i: number) => {
                return i === 0 ? v : (v.attrValue ? v.attrValue : '-');
            }).join(this.csvSep) + '\n';
        });

        return csv;
    }

    /*****************************************************************************
     Celendar and table functions
    *****************************************************************************/

    private resetCalendars(): void {
        if (this.dateFrom) {
            this.dateFrom.setSeconds(0);
            this.dateFrom.setMilliseconds(0);
        }
        if (this.dateTo) {
            this.dateTo.setSeconds(0);
            this.dateTo.setMilliseconds(0);
        }
    }

    private resetTable(): void {
        this.totalRecords = undefined;
        this.table.reset();
    }

}
