import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Route } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Line1040Component } from '../line1040/line1040.component';

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
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.getProductionLines();
  }

  getProductionLines() {
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
  }
  timeCalculator(DBtime: string) {
    const actual = new Date(DBtime);
    const actualDate = new Date();
    const fechaAct = actualDate.getTime() - actual.getTime();
    return this.formatTime(fechaAct);
  }

  formatTime(time: number): string {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}
