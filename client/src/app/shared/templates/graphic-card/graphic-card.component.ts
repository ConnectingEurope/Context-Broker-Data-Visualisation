import { Component, ViewChild, AfterViewInit, Input } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-graphic-card',
  templateUrl: './graphic-card.component.html',
  styleUrls: ['./graphic-card.component.scss']
})
export class GraphicCardComponent implements AfterViewInit {

  @ViewChild('chart', { static: false }) private chartRef: any;

  @Input() chartConfig: any;

  protected chart: Chart;

  ngAfterViewInit() {
    this.showChart();
  }

  showChart() {
    this.chart = new Chart(this.chartRef.nativeElement, this.chartConfig);
  }

}
