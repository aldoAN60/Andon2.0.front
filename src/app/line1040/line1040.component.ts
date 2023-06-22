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

  ngOnInit(): void {
    // Código de inicialización, si es necesario
  }

  andonStop(): void {
    this.andonBtn = !this.andonBtn;
    this.changeBg = !this.changeBg;
    this.sharedService.andonActivate();
    
    if (this.isRunning) {
      clearInterval(this.intervalo);
    } else {
      this.intervalo = setInterval(() => {
        this.time += 10;
      }, 10);
    }
    this.isRunning = !this.isRunning;
    this.time = 0;
  }
}
