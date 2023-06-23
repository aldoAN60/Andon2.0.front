import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-line1040',
  templateUrl: './line1040.component.html',
  styleUrls: ['./line1040.component.css']
})
export class Line1040Component implements OnInit {
  constructor(private sharedService: SharedService) {}

  //lineNumber: string = 'al 1040/1019';
  time: number = 0;
  intervalo: any;
  isRunning: boolean = false;
  changeBg: boolean = false;
  andonBtn: boolean = true;
  andonTime:number = 0;

  ngOnInit(): void {
    // Código de inicialización, si es necesario
  }

  private intervalId: any;
  private startTime: number=0;

  andonStop(): void { //method to active the timer and the animation background change also for the button color

    this.andonBtn = !this.andonBtn;
    this.changeBg = !this.changeBg;
    this.sharedService.andonActivate();
    this.timer();

  }
  timer(){  //timer to count the time that the andon was activated
    if (this.isRunning) {
      clearInterval(this.intervalId);
      this.andonTime += this.time;
      this.time = 0;
    } else {
      this.startTime = Date.now() - this.time;
      this.intervalId = setInterval(() => {
        this.time = Date.now() - this.startTime;
      }, 10);
    }
    this.isRunning = !this.isRunning;
  }


  
/*
  andonStop(): void {
    this.andonBtn = !this.andonBtn;
    this.changeBg = !this.changeBg;
    this.sharedService.andonActivate();
    
    if (this.isRunning) {
      clearInterval(this.intervalo);
      //this.andonTime += this.time;
      //this.time = 0;
    } else {
      this.intervalo = setInterval(() => {
        this.time += 10;
      }, 10);
    }
    this.isRunning = !this.isRunning;
    //this.time = 0;
  } */
}
