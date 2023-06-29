import { Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Route } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  productionLines: any; // object saves the information from db consult

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router){}

  ngOnInit(){
        this.getProductionLines();   
        
      

  }

  getProductionLines() {
    const url = 'http://127.0.0.1:8000/api/dashboard-maintenance';
    this.http.get<any>(url).subscribe(
      (data) => {
        this.productionLines = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
