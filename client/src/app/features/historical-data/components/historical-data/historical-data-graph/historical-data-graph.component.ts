import { Component, OnInit, Input } from '@angular/core';
import { SelectItem } from 'primeng/api/selectitem';
import { AggregatePeriod } from '../../../services/historical-data.service';

@Component({
    selector: 'app-historical-data-graph',
    templateUrl: './historical-data-graph.component.html',
    styleUrls: ['./historical-data-graph.component.scss'],
})
export class HistoricalDataGraphComponent implements OnInit {

    protected currentAttr: AggregatePeriod;
    protected currentRange: string;

    protected attrs: SelectItem[] = [
        { label: 'NO', value: 'NO' },
        { label: 'CO', value: 'CO' },
    ];
    protected ranges: SelectItem[] = [
        { label: 'Minute', value: AggregatePeriod.MINUTE },
        { label: 'Hour', value: AggregatePeriod.HOUR },
        { label: 'Day', value: AggregatePeriod.DAY },
        { label: 'Month', value: AggregatePeriod.MONTH },
    ];

    protected chartConfig: any = {
        type: 'line',
        data: {
            labels: ['14:00', '18:00'],
            datasets: [{
                label: 'NO2',
                data: [24, 20],
                backgroundColor: 'lightblue',
                borderColor: 'lightblue',
                fill: false,
            }],
        },
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

    @Input() private entityMetadata: any;

    constructor() { }

    public ngOnInit(): void {
    }

}
