import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { fromEvent, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SharedServicesService {


  constructor() { }



  formatTime(time: number): string {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  }

  timeCalculator(DBtime: string) {
    const DBtimeStop = new Date(DBtime);
    const actualDate = new Date();
    const counter = actualDate.getTime() - DBtimeStop.getTime();
    
    return this.formatTime(counter);
  }
}
