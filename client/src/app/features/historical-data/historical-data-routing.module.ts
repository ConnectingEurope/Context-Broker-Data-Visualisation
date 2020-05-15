import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HistoricalDataComponent } from './components/historical-data.component';

const routes: Routes = [{ path: '', component: HistoricalDataComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HistoricalDataRoutingModule { }
