import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Line1040Component } from './line1040/line1040.component';
import { ClockComponent } from './clock/clock.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';

/*const appRoutes:Routes  = [
  {path : '', component: HomeComponent},
  {path: '1040', component:Line1040Component}
];*/

@NgModule({
  declarations: [
    AppComponent,
    Line1040Component,
    ClockComponent,
    HomeComponent,
    
    
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
