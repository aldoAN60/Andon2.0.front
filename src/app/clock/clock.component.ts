import { Component } from '@angular/core';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.css']
})
export class ClockComponent {
 hrs: Date = new Date();
 Cdate: Date = new Date();


  constructor() {
    setInterval(() => {
      this.hrs = new Date();
    }, 1000);
    this.Cdate = new Date();
  }
  
}
