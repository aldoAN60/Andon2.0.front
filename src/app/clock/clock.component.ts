import { Component } from '@angular/core';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.css']
})
export class ClockComponent {
  /**
   * @type {Date} esta variable almacena la fecha actual pero mostrara solo la hora en formato [hh:mm:ss a]
   */
  timeNow!: Date;
  /**
   * @type {Date} esta variable almacena la fecha actual y la mostrara en formato [dd/MM/yyyy]
   */
  currentDate!: Date;


  constructor() {
    setInterval(() => {
      this.timeNow = new Date();
    }, 1000);
    this.currentDate = new Date();
  }
  
}
