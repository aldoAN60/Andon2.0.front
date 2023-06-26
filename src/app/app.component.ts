import { Component, ViewChild } from '@angular/core';
import { Line1040Component } from './line1040/line1040.component';
import { ClockComponent } from './clock/clock.component';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedService } from './shared/shared.service';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  
}
