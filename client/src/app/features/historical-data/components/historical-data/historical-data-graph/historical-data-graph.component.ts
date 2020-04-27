import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api/selectitem';
import { HistoricalDataService } from '../../../services/historical-data.service';
import { EntityMetadata } from 'src/app/shared/models/entity-metadata';
import * as moment from 'moment';
import { GraphicCardComponent } from 'src/app/shared/templates/graphic-card/graphic-card.component';
import { AggregatePeriod, AggregateMethod } from 'src/app/features/historical-data/models/historical-data-objects';
import { Observable } from 'rxjs';
import { combineLatest } from 'rxjs';
import { Moment } from 'moment';
import { DateUtilsService } from '../../../services/date-utils.service';
import { BaseComponent } from 'src/app/shared/misc/base.component';
import { takeUntil } from 'rxjs/operators';

enum AttrType {
    NUMBER,
    STRING,
    OBJECT,
    UNDEFINED,
}

@Component({
    selector: 'app-historical-data-graph',
    templateUrl: './historical-data-graph.component.html',
    styleUrls: ['./historical-data-graph.component.scss'],
})
export class HistoricalDataGraphComponent extends BaseComponent implements OnInit {

    @Input() public entityMetadata: EntityMetadata;

    public firstYear: number = 2000;
    public currentYear: number;
    public years: SelectItem[];

    public currentAttr: string;
    public currentPeriod: AggregatePeriod = AggregatePeriod.MINUTE;

    public hourDate: Date;
    public dayDate: Date;
    public monthDate: Date;
    public yearDate: number;

    // protected graphicHasDataForNumber: boolean = false;
    // protected graphicHasDataForString: boolean = false;
    // protected complexAttrSelected: boolean = false;

    protected attrType: AttrType;

    protected aggrPeriodEnum: typeof AggregatePeriod = AggregatePeriod;
    protected attrTypeEnum: typeof AttrType = AttrType;

    protected attrs: SelectItem[];
    protected ranges: SelectItem[] = [
        { label: 'Hour', value: AggregatePeriod.MINUTE },
        { label: 'Day', value: AggregatePeriod.HOUR },
        { label: 'Month', value: AggregatePeriod.DAY },
        { label: 'Year', value: AggregatePeriod.MONTH },
    ];

    protected chartConfigForNumber: any = {
        type: 'line',
        options: { scales: { yAxes: [{ ticks: { beginAtZero: false } }] } },
    };

    protected chartConfigForString: any = {
        type: 'bar',
        options: {
            scales: { yAxes: [{ ticks: { beginAtZero: true } }] },
            legend: { labels: { boxWidth: 0 } },
        },
    };

    @ViewChild('graphicCardForNumber', { static: false }) private graphicCardForNumber: GraphicCardComponent;
    @ViewChild('graphicCardForString', { static: false }) private graphicCardForString: GraphicCardComponent;

    constructor(
        private historicalDataService: HistoricalDataService,
        private dateUtilsService: DateUtilsService,
    ) {
        super();
        dateUtilsService.setupDates(this);
    }

    public ngOnInit(): void {
        this.attrs = this.entityMetadata.attrs.map(a => ({ label: a, value: a }));
        this.currentAttr = this.attrs[0].value;
        this.getHistoricalData();
    }

    protected onChange(): void {
        this.getHistoricalData();
    }

    protected getHistoricalData(): void {
        if (!isNaN(this.entityMetadata.data[this.currentAttr])) {
            this.getHistoricalDataForNumber();
        } else if (typeof this.entityMetadata.data[this.currentAttr] === 'string') {
            this.getHistoricalDataForString();
        } else if (this.entityMetadata.data[this.currentAttr] === undefined) {
            this.attrType = AttrType.UNDEFINED;
        } else {
            this.attrType = AttrType.OBJECT;
        }
    }

    private getHistoricalDataForNumber(): void {
        combineLatest([
            this.getAggregatedData(AggregateMethod.SUM),
            this.getAggregatedData(AggregateMethod.MIN),
            this.getAggregatedData(AggregateMethod.MAX),
        ]).pipe(takeUntil(this.destroy$)).subscribe(
            ([sumValues, minValues, maxValues]) => {
                this.showDataForNumber(sumValues, minValues, maxValues);
                this.attrType = AttrType.NUMBER;
            },
            err => {
                this.attrType = AttrType.UNDEFINED;
            });
    }

    private getAggregatedData(aMethod: AggregateMethod): Observable<any> {
        return this.historicalDataService.getAggregate(this.entityMetadata, this.currentAttr, {
            aggrMethod: aMethod,
            aggrPeriod: this.currentPeriod,
            dateFrom: this.dateUtilsService.getDateFrom(this),
            dateTo: this.dateUtilsService.getDateTo(this),
        });
    }

    private getHistoricalDataForString(): void {
        this.getAggregatedData(AggregateMethod.OCCUR).pipe(takeUntil(this.destroy$)).subscribe(
            occurValues => {
                this.showDataForString(occurValues);
                this.attrType = AttrType.STRING;
            },
            err => {
                this.attrType = AttrType.UNDEFINED;
            });
    }

    private showDataForNumber(sumValues: any[], minValues: any[], maxValues: any[]): void {
        const avgHasDecimals: boolean = this.hasAvgDecimals(minValues, maxValues);
        this.graphicCardForNumber.chart.data = {
            labels: sumValues.map(p => {
                return this.dateUtilsService.getDateFormat(p.offset, this);
            }),
            datasets: [
                {
                    label: 'Average',
                    data: sumValues.map(p => avgHasDecimals ? (p.sum / p.samples).toFixed(2) : Math.round(p.sum / p.samples)),
                    backgroundColor: 'lightgreen',
                    borderColor: 'lightgreen',
                    fill: false,
                    // lineTension: 0,
                },

                {
                    label: 'Minimum',
                    data: minValues.map(p => p.min),
                    backgroundColor: 'lightblue',
                    borderColor: 'lightblue',
                    fill: false,
                    // lineTension: 0,
                },

                {
                    label: 'Maximum',
                    data: maxValues.map(p => p.max),
                    backgroundColor: 'purple',
                    borderColor: 'purple',
                    fill: false,
                    // lineTension: 0,
                },
            ],
        };
        this.graphicCardForNumber.chart.update();
    }

    private hasAvgDecimals(minValues: any[], maxValues: any[]): boolean {
        return minValues.some(p => this.hasNumberDecimals(p.min)) || maxValues.some(p => this.hasNumberDecimals(p.max));
    }

    private hasNumberDecimals(value: any): boolean {
        return value.toString().indexOf('.') !== -1 || value.toString().indexOf(',') !== -1 || value.toString().indexOf('\'') !== -1;
    }

    private showDataForString(occurValues: any[]): void {
        const frecuency: any = this.getStringFrecuency(occurValues);
        this.graphicCardForString.chart.data = {
            labels: Object.keys(frecuency),
            datasets: [
                {
                    label: 'Occurrences of "' + this.currentAttr + '" values ' + this.dateUtilsService.getDatePeriod(this),
                    data: Object.values(frecuency),
                    backgroundColor: Object.keys(frecuency).map(k => 'rgba(' +
                        Math.floor(Math.random() * 255) + ',' +
                        Math.floor(Math.random() * 255) + ',' +
                        Math.floor(Math.random() * 255) + ', 0.5)',
                    ),
                },
            ],
        };
        this.graphicCardForString.chart.update();
    }

    private getStringFrecuency(occurValues: any[]): any {
        const frecuency: any = {};
        occurValues.forEach(v => {
            Object.keys(v.occur).forEach(k => {
                if (frecuency[k] === undefined) { frecuency[k] = 0; }
                frecuency[k] += v.occur[k];
            });
        });
        return frecuency;
    }

}
