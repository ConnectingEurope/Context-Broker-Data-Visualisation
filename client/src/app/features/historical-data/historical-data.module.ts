import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistoricalDataRoutingModule } from './historical-data-routing.module';
import { HistoricalDataComponent } from './components/historical-data/historical-data.component';
import { HistoricalDataTableComponent } from './components/historical-data/historical-data-table/historical-data-table.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
    declarations: [
        HistoricalDataComponent,
        HistoricalDataTableComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        HistoricalDataRoutingModule,
    ],
})
export class HistoricalDataModule { }
