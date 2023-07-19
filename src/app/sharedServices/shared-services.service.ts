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


/**
 * @author aldo armenta
 * @description 
 * Este método toma un valor de tiempo en milisegundos y lo formatea en el formato "hh:mm:ss". 
 * Primero, calcula las horas, los minutos y los segundos correspondientes utilizando operaciones matemáticas
 * y el operador de módulo. Luego, utiliza el método padStart() para asegurarse de que cada componente de tiempo 
 * tenga dos dígitos, agregando ceros a la izquierda si es necesario.
 * @param time valor en milisegundos
 * @returns retorna el tiempo en formato [hh:mm:ss] como una cadena.
 */
  formatTime(time: number): string {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  }

  /**
   * @author aldo armenta
   * @description
   * Este método calcula la diferencia de tiempo entre una fecha proporcionada (DBtime) y la fecha actual. 
   * Primero, crea objetos Date utilizando las fechas proporcionadas y la fecha actual. Luego, utiliza la función 'getTime()' 
   * para obtener el tiempo en milisegundos de cada objeto tipo Date. A continuación, 
   * calcula la diferencia entre estos dos valores en milisegundos.
   * @param DBtime fecha extraida en la base de datos en formato [YYYY-MM-DDTHH:mm:ss].
   * @returns Con la ayuda del metodo 'fromatTime()' regresa la diferencia de tiempo en formato [hh:mm:ss].
   */
  timeCalculator(DBtime: string) {
    const DBtimeStop = new Date(DBtime);
    const actualDate = new Date();
    const counter = actualDate.getTime() - DBtimeStop.getTime();
    
    return this.formatTime(counter);
  }
}
