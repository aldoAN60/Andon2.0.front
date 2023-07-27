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
  /**
   * @type {any} almacena las respuesta de las peticiones HTTP en forma de objeto para posteriormente mostrar
   * los datos almacenados en el HTML
   */
  productionLines: any; // object saves the information from db consult
  /**
   * @type {boolean} se utiliza para comprobar si alguna linea de produccion del objeto productionLines tiene el valor 'STOPPED'
   * y si es asi cambia el valor a false 
   */
  LinesRunning: boolean = true;



  constructor(
    private http: HttpClient,
    public sharedService: SharedServicesService
  ) {}

  ngOnInit() {
    this.getProductionLines();
    this.reloadPage();
  }
  /**
   * @author aldo armenta
   * @description
   * esta funcion realiza una peticion HTTP a la API de laravel para obtener los datos de las lineas de produccion
   * @returns regresa la variable "produccionLines" con los datos de las lineas de produccion.
   *  Y cambia el estado de la variable "LinesRunning" de 'true' a 'false' si el codigo encuentra que alguna linea de produccion esta parada
   * y si no la encuentra mantiene el valor en 'true'.
   */
  getProductionLines() {
    const url = 'http://127.0.0.1:8000/api/dashboard-maintenance';
    
    return this.http.get<any>(url).pipe(
      map((data) => {
        this.productionLines = data;
        this.LinesRunning = !this.productionLines.some((line: { current_status: string; }) => line.current_status === 'STOPPED');
      })
    ).subscribe();
  }

  /**
   * @author aldo armenta
   * @description
   * establece un intervalo de tiempo de 5 segundos y, en cada intervalo, llama al método getProductionLines() 
   * para obtener las líneas de producción. Esto permite actualizar periódicamente la información de las líneas de produccion
   * sin tener que recargar la página.
   */
  reloadPage(){
    const interval$ = interval(5000); // 10000 milisegundos = 10 segundos
    interval$.pipe(take(Infinity)).subscribe(() => {
      this.getProductionLines();
      
    });
    
  }
}
