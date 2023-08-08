import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core'; 
import { map } from 'rxjs';

@Component({
  selector: 'app-wrong-route',
  templateUrl: './wrong-route.component.html',
  styleUrls: ['./wrong-route.component.css']
})
export class WrongRouteComponent implements OnInit {
    /**
   * @type {any} almacena las respuesta de las peticiones HTTP en forma de objeto para posteriormente mostrar
   * los datos almacenados en el HTML
   */
  production_lines: any;
  router: any;
  constructor(private http: HttpClient){
    
  };
  ngOnInit(): void {
this.getProductionLines();
  }

  redirectToSelectLine(){
    const select_line = document.getElementById('line_numbers') as HTMLSelectElement;
    const selectedValue = select_line.value;
    if (selectedValue === "notSelect") {
      const wrong_select = document.getElementById('wrong-select') as HTMLElement;
      wrong_select.style.display = 'block';
    } else {
      location.replace('http://localhost:4200/production_lines/'+selectedValue);  
    }
    
  }

  getProductionLines(){
    const url = 'http://127.0.0.1:8000/api/dashboard-maintenance';

    return this.http.get<any>(url).pipe(
      map((data) => {
        this.production_lines = data;
      })
    ).subscribe();
  }
}
