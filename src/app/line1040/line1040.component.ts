import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared/shared.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-line1040',
  templateUrl: './line1040.component.html',
  styleUrls: ['./line1040.component.css'],
})
export class Line1040Component implements OnInit {
  
  title = 'Andon2.0.front';
  imagepath: string = 'assets/img/ZKW-Logo.png';
  lineNumber: string = 'al 1040/1019';

  productionLines: any;
  time: number = 0;
  intervalo: any;
  isRunning: boolean = false;
  changeBg: boolean = false;
  andonBtn: boolean = true;
  andonTime: number = 0;

  private intervalId: any;
  private startTime: number = 0;

  audio: HTMLAudioElement;
  audiopath: string = 'assets/audio/alarm.mp3';
  isplaying = false;

  constructor(private route: ActivatedRoute, private http: HttpClient, public sanitizer: DomSanitizer) {
    this.audio = new Audio();
    this.audio.src = this.audiopath;

  }

  ngOnInit(){
    this.route.paramMap.subscribe((params) => {
      const line_number = params.get('line_number');
      
      if (line_number !== null) {
        this.getProductionLines(line_number);   
        
      }else{
      
      }

    });
    
  }

  

  getProductionLines(line_number: string) {
    const url = 'http://127.0.0.1:8000/api/production_lines/' + line_number;
    this.http.get<any>(url).subscribe(
      (data) => {
        this.productionLines = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }


  andonStop(): void {
    //method to active the timer, alarm,  background color change animation and for the button color

    this.andonBtn = !this.andonBtn;
    this.changeBg = !this.changeBg;
    this.isplaying = !this.isplaying;
    this.timer();
    this.andonAlarm();
  }
  timer() {
    //timer to count the time that the andon was activated
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
  andonAlarm() {
    
    if (this.isplaying) {
      this.audio.loop = true;
      this.audio.play();
    } else {
      this.audio.loop = false;
      this.audio.pause();
    }
  }
}