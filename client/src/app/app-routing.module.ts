import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'map-dashboard',
    loadChildren: (): any => import('./features/map-dashboard/map-dashboard.module').then(m => m.MapDashboardModule),
  },
  {
    path: 'stats-dashboard',
    loadChildren: (): any => import('./features/stats-dashboard/stats-dashboard.module').then(m => m.StatsDashboardModule),
  },
  {
    path: '',
    redirectTo: 'map-dashboard',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
