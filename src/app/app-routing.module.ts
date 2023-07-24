import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Line1040Component } from './line1040/line1040.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WrongRouteComponent } from './wrong-route/wrong-route.component';
import { ProcessMonitor1Component } from './process-monitor1/process-monitor1.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'production_lines/:line_number', component: Line1040Component},
  {path: 'dashboard-maintenance', component: DashboardComponent},
  {path: 'process-monitor-1', component: ProcessMonitor1Component},
  {path: '**', component: WrongRouteComponent},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


