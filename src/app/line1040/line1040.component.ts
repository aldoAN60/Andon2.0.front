import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { SharedServicesService } from '../sharedServices/shared-services.service';
import { Observable, Subject, throwError } from 'rxjs';

import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';


@Component({
  selector: 'app-line1040',
  templateUrl: './line1040.component.html',
  styleUrls: ['./line1040.component.css'],
})
export class Line1040Component implements OnInit {
  response: any;
  private responseSubject: Subject<any> = new Subject<any>();
  response$: Observable<any> = this.responseSubject.asObservable();


  // restored data 
  localStorageAndonTime: number = 0;
  changeBg: boolean = false; // activates the background change color animation when the andon button is pressed
  andonBtn: boolean = true; // activates the background color change of the andon button
  isRunning: boolean = false;
  isplaying: boolean = false;

  productionLines: any; // object saves the information from db consult

  // variables for the timer
  time: number = 0; // increments variable for the timer 
  
  
  testdata: any; // test variable 



  reasons: string[] = [ // trash data just for testing
    'ACCIDENT',
    'NO REASON GIVEN',
    'WO MATERIAL',
    'LUNCHTIME',
    'SHIFT CHANGE',
  ];

  audio: HTMLAudioElement;
  audiopath: string = 'assets/audio/alarm.mp3';
  

  actualLineNumber: any;
  actualCST:any;
  actualLTS:any;

  count: number = 0;
  reloadCatcher : any;

  

  constructor(
    private route: ActivatedRoute, 
    private http: HttpClient, 
    private router: Router, 
    public dataService: SharedServicesService
    ) {
    this.audio = new Audio();
    this.audio.src = this.audiopath;

  }

  ngOnInit() {
    

    this.route.paramMap.subscribe((params) => {
      const line_number = params.get('line_number');
      
      if (line_number !== null ) {
        this.actualLineNumber = line_number;
        this.getProductionLines(line_number);
        this.getCST(line_number);
        
      }
    });

    this.resoredData();
    
    this.checkingTimeLeft();
    
    
  }
  
  
  
 
  

  andonStop(): void { //method that just call all the other methods 
    this.count++;
    
    
    const mainReason =  this.getRandomReason();
    this.andonBtn = !this.andonBtn;
    localStorage.setItem('andonBTN ' + this.actualLineNumber,  this.andonBtn.toString());

    this.changeBg = !this.changeBg;
    localStorage.setItem('changeBg ' + this.actualLineNumber,  this.changeBg.toString());

    this.isplaying = !this.isplaying;
    //this.timer();
    this.andonAlarm();
    
    if (this.andonBtn) {
      this.andonUnactivation(this.actualLineNumber);
      this.count = 0;

    } else {
      this.andonActivation(this.actualLineNumber, mainReason);
    }
  }

 
  



  /**********************GETINGS METHODS*********************************/
  getProductionLines(line_number: string) { // method that requests to an API the information of some production line
    const url = 'http://127.0.0.1:8000/api/production_lines/' + line_number;
  
  this.http.get<any>(url).pipe(
    tap((data) => {
      this.productionLines = data;
      if (typeof this.productionLines.line_number === 'undefined') {
        this.router.navigate(['/nonexistent-route']);
      }
    }),
    catchError((error) => {
      console.error(error);
      return of(null);
    })
  ).subscribe();
    
    /*const url = 'http://127.0.0.1:8000/api/production_lines/' + line_number;
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
    );*/
  }

  getCST(line_number: string){
  const url ='http://127.0.0.1:8000/api/cumulative_stoppage_time/' + line_number;
  this.http.get<any>(url).pipe(
    tap((data) => {
      this.actualCST = data;
      //this.timeCalculator(this.actualCST.stopped_at);
      this.dataService.timeCalculator(this.actualCST.stopped_at);
    }),
    catchError((error) => {
      console.error(error);
      return of (null);
    })
  ).subscribe();
   /* const url ='http://127.0.0.1:8000/api/cumulative_stoppage_time/' + line_number;
    this.http.get<any>(url).subscribe(
      (data) => {
        this.actualCST = data;
        this.timeCalculator(this.actualCST.stopped_at);
      },
      (error) => {
        console.error(error);
      }
      );*/
  } 
  

  /************************UPDATING METHODS*********************/
  andonActivation(line_number: string, reason: string) { // method that activates the andon and create an update on the DB on the columns reason stopped_at and current_status 
  
    
    const url = 'http://127.0.0.1:8000/api/Andon-activation-update/' + line_number + '-' + reason;
      this.http.get<any>(url).subscribe(
        (Response) => {
          console.log('andon start');
          this.getCST(this.actualLineNumber); // getting the update information from the DB
        },
        (error) => {
          console.error('error', error);
        }
      );
    }
    

  andonUnactivation(line_number: string) { // method that unactivates the andon and create an update on the DB on the columns reason runing_at and current_status
    const tiempo = this.dataService.timeCalculator(this.actualCST.stopped_at);
    
    this.time = this.convertTimeToSeconds(tiempo);
    this.localStorageAndonTime += this.time;
    
    localStorage.setItem('andonTime ' + this.actualLineNumber, this.localStorageAndonTime.toString());
    
    const url =
      'http://127.0.0.1:8000/api/Andon-unactivation-update/' + line_number + '-'  + this.convertSecondsToTime(this.localStorageAndonTime);

    this.http.get<any>(url).subscribe(
      (Response) => {
        console.log('andon stop');
        this.getCST(this.actualLineNumber); // getting the update information from the DB
      },
      (error) => {
        console.error('error', error);
      }
    );
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

  /**********************helpers methods******************/
  

  getRandomReason() { // trash method it's just to get a random item from the object reasons 
    const random = Math.round(Math.random() * (this.reasons.length - 1));
    return this.reasons[random];
  }
  
  convertTimeToSeconds(time: string): number {
    const timeParts = time.split(':');
    const hours = parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1]);
    const seconds = parseInt(timeParts[2]);
  
    const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
    return totalSeconds;
  }
  convertSecondsToTime(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
/******  methods probably i gonna use ********/ 
  resoredData(){
    const storedValue = localStorage.getItem('andonTime ' + this.actualLineNumber);
    
      // Si existe un valor previo, asignarlo a la variable localStorageAndonTime
      this.localStorageAndonTime = parseInt(storedValue ?? '0');
    

    const andonBTNRestored: string | null = localStorage.getItem('andonBTN ' + this.actualLineNumber);
    const changeBgRestored: String | null = localStorage.getItem('changeBg ' + this.actualLineNumber);
  
  

    if (andonBTNRestored === 'true' || andonBTNRestored == null ) {
      this.andonBtn = true;
    } else {
      this.andonBtn = false;
    }
    if (changeBgRestored === 'false' || changeBgRestored == null ) {
      this.changeBg = false;
    } else {
      this.changeBg = true;
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
        this.shiftChange();

      }, shift_1Diff);
    }

    const shift_2 = new Date();
    shift_2.setHours(23);
    shift_2.setMinutes(0);
    shift_2.setSeconds(0);

    const shift_2Diff =  shift_2.getTime() - currentTime.getTime() ; // Diferencia de tiempo en milisegundos

    if (shift_2Diff > 0) {
      setTimeout(() => {
        // Lógica a ejecutar en la hora objetivo
        this.shiftChange();

      }, shift_2Diff);
    }
    const shift_3 = new Date();
    shift_3.setDate(shift_3.getDate()+1);
    shift_3.setHours(7);
    shift_3.setMinutes(0);
    shift_3.setSeconds(0);

    const shift_3Diff =  shift_3.getTime() - currentTime.getTime() ; // Diferencia de tiempo en milisegundos

    if (shift_3Diff > 0) {
      setTimeout(() => {
        // Lógica a ejecutar en la hora objetivo
        this.shiftChange();

      }, shift_3Diff);
    }
    console.log(currentTime);
    console.log('faltan ' + this.dataService.formatTime(shift_1Diff) + ' para que termine el turno 1');
    console.log('faltan ' + this.dataService.formatTime(shift_2Diff) + ' para que termine el turno 2');
    console.log('faltan ' + this.dataService.formatTime(shift_3Diff) + ' para que termine el turno 3');
  }
  shiftChange(){ // the method get ivoke when the shift change. it clear the localStorage, reset the cumulative stoppage time and reload the page
  
    localStorage.clear();
    location.reload();
  }
}
