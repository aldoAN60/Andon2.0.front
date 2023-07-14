import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedServicesService } from '../sharedServices/shared-services.service';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  productionLines: any; // object saves the information from db consult
  stoppedProductionLines: any;
  receivedVariable: string = '';
  LinesRunning: boolean = true;

  fechaActual = new Date();


  constructor(
    private http: HttpClient,
    public sharedService: SharedServicesService
  ) {}

  ngOnInit() {
    this.getProductionLines();
    const interval$ = interval(5000); // 10000 milisegundos = 10 segundos
    interval$.pipe(take(Infinity)).subscribe(() => {
      this.getProductionLines();

    });
  }
  
  getProductionLines() {
    const url = 'http://127.0.0.1:8000/api/dashboard-maintenance';
    
    return this.http.get<any>(url).pipe(
      map((data) => {
        this.productionLines = data;
        this.LinesRunning = !this.productionLines.some((line: { current_status: string; }) => line.current_status === 'STOPPED');
      })
    ).subscribe();
  }
/*  getProductionLines() {
    const url = 'http://127.0.0.1:8000/api/dashboard-maintenance';
    this.http.get<any>(url).subscribe(
      (data) => {
        this.productionLines = data;
        for (let index = 0; index < this.productionLines.length; index++) {
          if (this.productionLines[index].current_status == 'STOPPED') {
            this.LinesRunning = false;
          }
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }*/
}
