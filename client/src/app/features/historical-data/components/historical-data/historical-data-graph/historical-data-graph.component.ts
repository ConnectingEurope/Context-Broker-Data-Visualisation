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

@Component({
    selector: 'app-historical-data-graph',
    templateUrl: './historical-data-graph.component.html',
    styleUrls: ['./historical-data-graph.component.scss'],
})
export class HistoricalDataGraphComponent implements OnInit {

    @Input() public entityMetadata: EntityMetadata;

    protected firstYear: number = 2000;
    protected currentYear: number;
    protected years: SelectItem[];

    protected graphicHasData: boolean = false;

    protected aggrPeriod: typeof AggregatePeriod = AggregatePeriod;
    protected currentAttr: string;
    protected currentPeriod: AggregatePeriod = AggregatePeriod.MINUTE;

    protected hourDate: Date;
    protected dayDate: Date;
    protected monthDate: Date;
    protected yearDate: number;

    protected attrs: SelectItem[];
    protected ranges: SelectItem[] = [
        { label: 'Hour', value: AggregatePeriod.MINUTE },
        { label: 'Day', value: AggregatePeriod.HOUR },
        { label: 'Month', value: AggregatePeriod.DAY },
        { label: 'Year', value: AggregatePeriod.MONTH },
    ];

    protected chartConfig: any = {
        type: 'line',
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: false,
                    },
                }],
            },
        },
    };

    @ViewChild('graphicCard', { static: false }) private graphicCard: GraphicCardComponent;

    constructor(private historicalDataService: HistoricalDataService) {
        this.currentYear = new Date().getFullYear();
        this.yearDate = this.currentYear;
        const yearsRange: number[] = [...Array(this.currentYear - this.firstYear).keys()].map(y => y + this.firstYear);
        this.years = yearsRange.map(y => ({ label: String(y), value: y }));
    }

    public ngOnInit(): void {
        this.attrs = this.entityMetadata.attrs.map(a => ({ label: a, value: a }));
        this.currentAttr = this.attrs[0].value;
    }

    protected onChange(): void {
        this.getHistoricalData();
    }

    protected getDefaultHourDate(): Date {
        const date: Date = new Date();
        date.setMinutes(0);
        return date;
    }

    protected getHistoricalData(): void {
        combineLatest([
            this.getAggregatedData(AggregateMethod.SUM),
            this.getAggregatedData(AggregateMethod.MIN),
            this.getAggregatedData(AggregateMethod.MAX),
        ]).subscribe(
            ([sumValues, minValues, maxValues]) => {
                this.showData(minValues, sumValues, maxValues);
                this.graphicHasData = true;
            },
            err => {
                this.graphicHasData = false;
            });
    }

    private getAggregatedData(aMethod: AggregateMethod): Observable<any> {
        return this.historicalDataService.getAggregate(this.entityMetadata, this.currentAttr, {
            aggrMethod: aMethod,
            aggrPeriod: this.currentPeriod,
            dateFrom: this.getDateFrom(),
            dateTo: this.getDateTo(),
        });
    }

    private showData(sumValues: any[], minValues: any[], maxValues: any[]): void {
        this.graphicCard.chart.data = {
            labels: sumValues.map(p => {
                return this.getDateFormat(p.offset);
            }),
            datasets: [

                {
                    label: 'Average',
                    data: sumValues.map(p => Math.round(p.sum / p.samples)),
                    backgroundColor: 'lightblue',
                    borderColor: 'lightblue',
                    fill: false,
                },

                {
                    label: 'Minimum',
                    data: minValues.map(p => p.min),
                    backgroundColor: 'lightgreen',
                    borderColor: 'lightgreen',
                    fill: false,
                },

                {
                    label: 'Maximum',
                    data: maxValues.map(p => p.max),
                    backgroundColor: 'purple',
                    borderColor: 'purple',
                    fill: false,
                },
            ],
        };
        this.graphicCard.chart.update();
    }

    private getDateFrom(): string {
        let d: Date;
        switch (this.currentPeriod) {

            case AggregatePeriod.MINUTE:
                d = new Date(this.hourDate);
                break;

            case AggregatePeriod.HOUR:
                d = new Date(this.dayDate);
                break;

            case AggregatePeriod.DAY:
                d = new Date(this.monthDate);
                d = new Date(d.getFullYear(), d.getMonth(), 1);
                break;

            case AggregatePeriod.MONTH:
                d = new Date(this.yearDate, 0, 1);
                break;

        }
        return d.toUTCString();
    }

    private getDateTo(): string {
        let d: Date;
        switch (this.currentPeriod) {

            case AggregatePeriod.MINUTE:
                d = new Date(this.hourDate);
                d.setHours((d.getHours() + 1) % 24);
                d.setMinutes(59);
                d.setSeconds(59);
                break;

            case AggregatePeriod.HOUR:
                d = new Date(this.dayDate);
                d.setHours(23);
                d.setMinutes(59);
                d.setSeconds(59);
                break;

            case AggregatePeriod.DAY:
                d = new Date(this.monthDate);
                d = new Date(d.getFullYear(), (d.getMonth() + 1) % 12, 1);
                break;

            case AggregatePeriod.MONTH:
                d = new Date(this.yearDate + 1, 0, 1);
                break;

        }
        return d.toUTCString();
    }

    private getDateFormat(offset: number): string {
        let d: Moment;

        switch (this.currentPeriod) {

            case AggregatePeriod.MINUTE:
                d = moment.utc(this.hourDate);
                d.minutes(offset);
                return moment(d).local().format('HH:mm');

            case AggregatePeriod.HOUR:
                d = moment.utc(this.dayDate);
                d.hours(offset);
                return moment(d).local().format('HH');

            case AggregatePeriod.DAY:
                return String(offset);

            case AggregatePeriod.MONTH:
                return moment().month(offset).format('MMMM');

        }
    }

}
