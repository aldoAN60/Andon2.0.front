import { Component, OnInit } from '@angular/core';
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
  andonTime: any; // saves the total time the andan was activated
  localStorageAndonTime: number = 0;

  changeBg: boolean = false; // activates the background change color animation when the andon button is pressed
  andonBtn: boolean = true; // activates the background color change of the andon button

  reasons: string[] = [ // trash data just for testing
    'ACCIDENT',
    'NO REASON GIVEN',
    'WO MATERIAL',
    'LUNCHTIME',
    'SHIFT CHANGE',
  ];

  audio: HTMLAudioElement;
  audiopath: string = 'assets/audio/alarm.mp3';
  isplaying = false;

  actualLineNumber: any;

  count: number = 0;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {
    this.audio = new Audio();
    this.audio.src = this.audiopath;
    const storedValue = localStorage.getItem('andonTime');
    this.localStorageAndonTime = parseInt(storedValue ?? '0');
    
    
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const line_number = params.get('line_number');
      this.actualLineNumber = line_number;
      line_number !== null ? this.getProductionLines(line_number) : '';
    });
    this.checkingTimeLeft();
  }

  

  andonStop(): void { //method that just call all the other methods 
    this.count++;
    const mainReason =  this.getRandomReason();
    

    this.andonBtn = !this.andonBtn;
    this.changeBg = !this.changeBg;
    this.isplaying = !this.isplaying;

    this.timer();
    this.andonAlarm();

    if (this.count == 2) {
      this.andonUnactivation(this.actualLineNumber);
      this.count = 0;
      location.reload();
    } else {
      this.andonActivation(this.actualLineNumber, mainReason);
    }
  }
  checkingTimeLeft(){
    const currentTime = new Date(); // Hora actual

    const shift_1 = new Date(); // Hora objetivo
    shift_1.setHours(15); // Establecer la hora objetivo (por ejemplo, 12:00 PM)
    shift_1.setMinutes(0); // Establecer los minutos objetivo (por ejemplo, 0 minutos)
    shift_1.setSeconds(0); // Establecer los segundos objetivo (por ejemplo, 0 segundos)
    const shift_1Diff = shift_1.getTime() - currentTime.getTime(); // Diferencia de tiempo en milisegundos

    if (shift_1Diff > 0) {
      setTimeout(() => {
        // Lógica a ejecutar en la hora objetivo
        this.shiftChangeXmorning();

      }, shift_1Diff);
    }

    const shift_2 = new Date();
    shift_2.setHours(23);
    shift_2.setHours(0);
    shift_2.setHours(0);

    const shift_2Diff = shift_2.getTime() - currentTime.getTime(); // Diferencia de tiempo en milisegundos

    if (shift_2Diff > 0) {
      setTimeout(() => {
        // Lógica a ejecutar en la hora objetivo
        this.shiftChangeXmorning();

      }, shift_2Diff);
    }
    const shift_3 = new Date();
    shift_3.setHours(7);
    shift_3.setHours(0);
    shift_3.setHours(0);

    const shift_3Diff = shift_3.getTime() - currentTime.getTime(); // Diferencia de tiempo en milisegundos

    if (shift_3Diff > 0) {
      setTimeout(() => {
        // Lógica a ejecutar en la hora objetivo
        this.shiftChangeXmorning();

      }, shift_3Diff);
    }

    console.log(shift_1Diff);
    console.log(shift_2Diff);
    console.log(shift_3Diff);
  }

  shiftChangeXmorning(){
    localStorage.clear();
    location.reload();
  }

  getProductionLines(line_number: string) { // method that requests to an API the information of some production line
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

  andonActivation(line_number: string, reason: string) { // method that activates the andon and create an update on the DB on the columns reason stopped_at and current_status 
    const url = 'http://127.0.0.1:8000/api/Andon-activation-update/' +line_number + '-' + reason;
      this.http.get<any>(url).subscribe(
        (Response) => {
          console.log('andon start');
        },
        (error) => {
          console.error('error', error);
        }
      );
    }
  andonUnactivation(line_number: string) { // method that unactivates the andon and create an update on the DB on the columns reason runing_at and current_status
    const url =
      'http://127.0.0.1:8000/api/Andon-unactivation-update/' + line_number + '-'  + this.formatTime(this.andonTime);

    this.http.get<any>(url).subscribe(
      (Response) => {
        console.log('andon stop');
      },
      (error) => {
        console.error('error', error);
      }
    );
  }

  getRandomReason() { // trash method it's just to get a random item from the object reasons 
    const random = Math.round(Math.random() * (this.reasons.length - 1));
    return this.reasons[random];
  }

  
  
  timer() { //method that activates a timer to count the time that the andon was activated
    

    if (this.isRunning) {
      clearInterval(this.intervalId);
      
      // Incrementar el valor y actualizar el localStorage
      this.localStorageAndonTime += this.time;
      localStorage.setItem('andonTime', this.localStorageAndonTime.toString());
      
      // Actualizar el valor de this.andonTime
      this.andonTime = this.localStorageAndonTime;
      console.log(this.formatTime(this.andonTime));
      this.time = 0;
    } else {
      this.startTime = Date.now() - this.time;
      this.intervalId = setInterval(() => {
        this.time = Date.now() - this.startTime;
      }, 1000);
    }
    this.isRunning = !this.isRunning;
  }
  andonAlarm() { // method that activates an alarm each time the andon is running
    if (this.isplaying) {
      this.audio.loop = true;
      this.audio.play();
    } else {
      this.audio.loop = false;
      this.audio.pause();
    }
  }
  formatTime(time: number): string {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}
