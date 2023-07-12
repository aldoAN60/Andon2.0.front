import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedServicesService } from '../sharedServices/shared-services.service';
@Component({
  selector: 'app-observable-test',
  templateUrl: './observable-test.component.html',
  styleUrls: ['./observable-test.component.css']
})
export class ObservableTestComponent {
  productionLines:any;

  constructor(private http: HttpClient, private dataService: SharedServicesService ){
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
  update(): void { // method that activates the andon and create an update on the DB on the columns reason stopped_at and current_status 
  
    
    const url = 'http://127.0.0.1:8000/api/Andon-activation-update/1001-WO material';
      this.http.get<any>(url).subscribe(
        (Response) => {
          console.log('andon start');
          this.getProductionLines();
        },
        (error) => {
          console.error('error', error);
        }
      );
      
    }
}
