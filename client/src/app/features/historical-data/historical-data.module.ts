import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistoricalDataRoutingModule } from './historical-data-routing.module';
import { HistoricalDataComponent } from './components/historical-data/historical-data.component';
import { HistoricalDataTableComponent } from './components/historical-data/historical-data-table/historical-data-table.component';
import { DropdownModule } from 'primeng/dropdown';
import { SharedModule } from 'src/app/shared/shared.module';
import { HistoricalDataGraphComponent } from './components/historical-data/historical-data-graph/historical-data-graph.component';
import { GraphicCardComponent } from 'src/app/shared/templates/graphic-card/graphic-card.component';
import { CardModule } from 'primeng/card/';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';


@NgModule({
    declarations: [
        HistoricalDataComponent,
        HistoricalDataTableComponent,
        HistoricalDataGraphComponent,
        GraphicCardComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        CardModule,
        HistoricalDataRoutingModule,
        DropdownModule,
        FormsModule,
        CalendarModule,
    ],
})
export class HistoricalDataModule { }
