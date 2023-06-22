import { Component, ViewChild } from '@angular/core';
import { Line1040Component } from './line1040/line1040.component';
import { ClockComponent } from './clock/clock.component';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedService } from './shared.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Andon2.0.front';
  imagepath: string = 'assets/img/ZKW-Logo.png';
  lineNumber: string = 'al 1040/1019';
  
 
 
constructor(public sanitizer: DomSanitizer, private sharedService: SharedService ){


}
get changeBg(): boolean {
  return this.sharedService.changeBg.value;
}



}
