import { Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-line1040',
  templateUrl: './line1040.component.html',
  styleUrls: ['./line1040.component.css'],
})
export class Line1040Component implements OnInit {

  

  productionLines: any; // object saves the information from db consult

  // variables for the timer
  time: number = 0;
  private intervalId: any;
  private startTime: number = 0;
  isRunning: boolean = false;
  andonTime: number = 0; // saves the total time the andan was activated

  changeBg: boolean = false; // activates the background change color animation when the andon button is pressed
  andonBtn: boolean = true; // activates the background color change of the andon button
  
reasons: string[] = ['ACCIDENT', 'NO REASON GIVEN','WO MATERIAL','LUNCHTIME'];
  

  audio: HTMLAudioElement;
  audiopath: string = 'assets/audio/alarm.mp3';
  isplaying = false;

  actualLineNumber: any;

  count: number = 0;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {
    this.audio = new Audio();
    this.audio.src = this.audiopath;


  }
  


  ngOnInit(){
    this.route.paramMap.subscribe((params) => {
      const line_number = params.get('line_number');
      this.actualLineNumber = line_number;
      (line_number !== null) ? this.getProductionLines(line_number)  : '';
    });
    
  }

  

  getProductionLines(line_number: string) {
    const url = 'http://127.0.0.1:8000/api/production_lines/' + line_number;
    this.http.get<any>(url).subscribe(
      (data) => {
        this.productionLines = data;
        
        if (typeof this.productionLines.line_number === 'undefined') {
          this.router.navigate(['/nonexistent-route']);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  andonActivation(line_number: string, reason:string){

    const url = 'http://127.0.0.1:8000/api/Andon-activation-update/' + line_number + '-' + reason;
    
    this.http.get<any>(url).subscribe(
      (Response) => {
        console.log('andon start');
      },
      (error) =>{
        console.error('error',error);
      }
    );

  }
  andonUnactivation(line_number:string){
    const url = 'http://127.0.0.1:8000/api/Andon-unactivation-update/' + line_number;
    
    this.http.get<any>(url).subscribe(
      (Response) => {
        console.log('andon stop');
      },
      (error) =>{
        console.error('error',error);
      }
    );
  }

 getRandomReason(){
  const random = Math.round(Math.random() * (this.reasons.length-1));
  return this.reasons[random];
 }

  andonStop(): void {
    this.count++;
    //method to active the timer, alarm,  background color change animation and for the button color
    
    this.andonBtn = !this.andonBtn;
    this.changeBg = !this.changeBg;
    this.isplaying = !this.isplaying;
    this.timer();
    this.andonAlarm();
    
     if (this.count==2){
      this.andonUnactivation(this.actualLineNumber)  
    this.count = 0;
     } else{
      this.andonActivation(this.actualLineNumber, this.getRandomReason());

     }
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