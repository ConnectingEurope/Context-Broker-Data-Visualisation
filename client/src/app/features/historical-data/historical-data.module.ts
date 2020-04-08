import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistoricalDataRoutingModule } from './historical-data-routing.module';
import { HistoricalDataComponent } from './components/historical-data/historical-data.component';


@NgModule({
    declarations: [
        HistoricalDataComponent,
    ],
    imports: [
        CommonModule,
        HistoricalDataRoutingModule,
    ],
})
export class HistoricalDataModule { }
