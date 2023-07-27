import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Line1040Component } from './line1040/line1040.component';
import { ClockComponent } from './clock/clock.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WrongRouteComponent } from './wrong-route/wrong-route.component';
import { ProcessMonitor1Component } from './process-monitor1/process-monitor1.component';



@NgModule({
  declarations: [
    AppComponent,
    Line1040Component,
    ClockComponent,
    HomeComponent,
    DashboardComponent,
    WrongRouteComponent,
    ProcessMonitor1Component,
    
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
