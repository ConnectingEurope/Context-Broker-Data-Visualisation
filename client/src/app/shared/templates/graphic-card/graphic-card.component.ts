import { Component, ViewChild, AfterViewInit, Input } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
    selector: 'app-graphic-card',
    templateUrl: './graphic-card.component.html',
    styleUrls: ['./graphic-card.component.scss'],
})
export class GraphicCardComponent implements AfterViewInit {

    @Input() public chartConfig: any;

    public chart: Chart;

    @ViewChild('chart', { static: false }) private chartRef: any;

    public ngAfterViewInit(): void {
        this.showChart();
    }

    private showChart(): void {
        this.chart = new Chart(this.chartRef.nativeElement, this.chartConfig);
    }

}
