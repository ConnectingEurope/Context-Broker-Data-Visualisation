import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-historical-data-graph',
    templateUrl: './historical-data-graph.component.html',
    styleUrls: ['./historical-data-graph.component.scss'],
})
export class HistoricalDataGraphComponent implements OnInit {

    protected chartConfig: any = {
        type: 'line',
        data: {
            labels: ['14:00', '15:00', '16:00', '17:00', '18:00'],
            datasets: [{
                label: 'NO2',
                data: [24, 20, 23, 15, 30],
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
