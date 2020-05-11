import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: 'map',
        loadChildren: (): any => import('./features/map-dashboard/map-dashboard.module').then(m => m.MapDashboardModule),
    },
    {
        path: 'configuration',
        loadChildren: (): any => import('./features/config-dashboard/config-dashboard.module').then(m => m.ConfigDashboardModule),
    },
    {
        path: 'historical-data/:type/:id',
        loadChildren: (): any => import('./features/historical-data/historical-data.module').then(m => m.HistoricalDataModule),
    },
    {
        path: '',
        redirectTo: 'map',
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
