import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { SharedServicesService } from '../sharedServices/shared-services.service';
import { Observable, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-line1040',
  templateUrl: './line1040.component.html',
  styleUrls: ['./line1040.component.css'],
})
export class Line1040Component implements OnInit {


/**
 * @type {number} esta varibale guarda el tiempo acumulado de paro de la linea de produccion.
 *  ademas lo guardara en el local storage del navegador.
 */
  localStorageAndonTime: number = 0;
  /**
   * @type {boolean} variable booleana  que activara (true) o desactivara (false) la animacion de cambio de color
   * del fondo al presionar el boton de activacion de andon.
   */
  changeBg: boolean = false; // activates the background change color animation when the andon button is pressed
  
  /**
   * @type {boolean} variable booleana  que activara (false) o desactivara (true) el cambio de color de verde a rojo
   * del fondo al presionar el boton de activacion de andon.
   */
  andonBtnColorChg: boolean = true; // activates the background color change of the andon button
  
  /**
   * @type {boolean} variable booleana que activa (true) o desactiva (false) el sonido de la alarma del andon al precionar
   * el boton de activacion de andon
   */
  isplaying: boolean = false;

    /**
   * @type {any} almacena las respuesta de las peticiones HTTP en forma de objeto para posteriormente mostrar
   * los datos almacenados en el HTML
   */
  productionLines: any; // object saves the information from db consult

  /**
  * @type {number} variable numerica que almacena el tiempo que estuvo activado el andon
  */
  time: number = 0; // increments variable for the timer 
  



/**
 * @type {string[]} arreglo de cadenas que almacena informacion desechable que simula razones de paro de lineas de produccion
 */
  reasons: string[] = [ // trash data just for testing
    'ACCIDENT',
    'NO REASON GIVEN',
    'WO MATERIAL',
    'LUNCHTIME',
    'SHIFT CHANGE',
  ];
/**
 * @type {HTMLAudioElement} variable que alamcena el sonido de alarma del andon
 */
  audio: HTMLAudioElement;
  /**
   * @type {string} variable de cadena que alamcena la ruta de donde se encuentra el audio de la alarma
   */
  audiopath: string = 'assets/audio/alarm.mp3';
  
/**
 * @type {any} variable tipo any que alamacena la informacion de la actual linea de produccion que se consulta desde la URL
 * de la pagina 
 */
  actualLineNumber: any;
  /**
 * @type {any} variable tipo any que alamacena el 'tiempo total de paro' (cumulative_stoppage_time) de la actual linea de
 * produccion que se consulta desde la URL de la pagina
 */
  actualCST:any;
  /**
 * @type {number} variable numerica que aumenta segun la cantidad de clicks que se le den al boton del andon
 *  (solo puede cambiar de 0 a 2)
 */
  count: number = 0;

  

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
  }
/**
 * @author aldo armenta
 * @description 
 * Esta función es llamada al hacer clic en un botón y ejecuta una serie de acciones relacionadas con el funcionamiento
 * del sistema de Andon. Dependiendo del estado actual del sistema, puede activar o desactivar el Andon, 
 * cambiar colores, animaciones y reproducir una alarma.
 */
andonStop(): void {
  this.count++;
  const mainReason = this.getRandomReason();

  this.toggleAndonBtnColorChg();
  this.toggleChangeBg();
  this.isplaying = !this.isplaying;

  if (this.andonBtnColorChg) {
    this.disabledAndonBTN();
    this.andonUnactivation(this.actualLineNumber);
    this.count = 0;
  } else {
    this.disabledAndonBTN();
    this.andonActivation(this.actualLineNumber, mainReason);
  }
}



/**
* @author aldo armenta
* @description
* Este metodo extrae el atributo tipo 'button' HTML con el id 'andonBTN' para posteriormente deshabilitarlo (disabled)
* y despues de 10 segundos volverlo a habilitar (enabled).
*/
disabledAndonBTN(){
  const andonBTN = document.getElementById('andonBTN') as HTMLButtonElement | null;
  andonBTN?.setAttribute('disabled','');
  setTimeout(() => {
    andonBTN?.removeAttribute('disabled');
  }, 10000);
}
  /**
   * @author aldo armenta
   * @description
   * Este método cambia el valor de la variable 'andonBtnColorChg' invirtiendo su estado actual. 
   * Luego, actualiza el valor correspondiente en el almacenamiento local del navegador (localStorage). 
   * Este método se utiliza en el método andonStop() para cambiar el color del botón relacionado con el estado del andon.
   * 
   */
  toggleAndonBtnColorChg(): void {
    this.andonBtnColorChg = !this.andonBtnColorChg;
    localStorage.setItem('andonBtnColorChg ' + this.actualLineNumber, this.andonBtnColorChg.toString());
  }
  
  /**
   * @author aldo armenta
   * @description 
   * Este método cambia el valor de  la variable 'changeBg' invirtiendo su estado actual. 
   * Luego, actualiza el valor correspondiente en el almacenamiento local del navegador (localStorage). 
   * Este método se utiliza en el método andonStop() para cambiar el fondo relacionado con el estado del andon.
   */
  toggleChangeBg(): void {
    this.changeBg = !this.changeBg;
    localStorage.setItem('changeBg ' + this.actualLineNumber, this.changeBg.toString());
  }
  
  
  /**********************GETINGS METHODS*********************************/
  /**
   * @author aldo armenta
   * @description
   * Esta función se utiliza para realizar una solicitud HTTP GET a la API de laravel para obtener información 
   * sobre una línea de producción específica. Recibe como parámetro el número de línea (line_number) 
   * para indicar cuál línea se desea consultar. Además, se verifica si la propiedad 'line_number'
   *  está definida en los datos recibidos. Si no está definida, se redirige a una ruta específica.
   * @param  line_number  numero de linea que se quiere consultar 
   */
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
  }

  /**
   * @author aldo armenta
   * @description
   * esta funcion se utiliza para realizar una solicitud HTTP GET a la API de laravel para obtener 
   * la hora en la que se detuvo (stopped_at) y mediante la funcion 'timeCalculator' actualizar el 
   * 'tiempo total de paro' (cumulative_stoppage_time) de una linea en especifico. 
   * Recibe como parámetro el número de línea (line_number) para indicar de cuál línea se desea consultar.
   * @param {string} line_number numero de linea que se quiere consultar 
   */
  getCST(line_number: string){
  const url ='http://127.0.0.1:8000/api/cumulative_stoppage_time/' + line_number;
  this.http.get<any>(url).pipe(
    tap((data) => {
      this.actualCST = data;
      this.dataService.timeCalculator(this.actualCST.stopped_at);
    }),
    catchError((error) => {
      console.error(error);
      return of (null);
    })
  ).subscribe();
  } 
  

  /************************UPDATING METHODS*********************/

  /**
   * @author aldo armenta 
   * @description
   * esta funcion realiza una peticion HTTP GET a la API de laravel para actualizar el 'numero de linea' (line_number)
   * y la 'razon' (reason) una vez realizada la actualizacion se llama al metodo getCST
   *  para mostrar el 'tiempo total de paro' actualizado
   * @param line_number numero de linea que se quiere actualizar 
   * @param reason la razon del porque paro la linea
   */
  andonActivation(line_number: string, reason: string) { // method that activates the andon and create an update on the DB on the columns reason stopped_at and current_status 
  
    
    const url = 'http://127.0.0.1:8000/api/Andon-activation-update/' + line_number + '-' + reason;
      this.http.get<any>(url).subscribe(
        (Response) => {
          console.log('andon start');
          this.getCST(line_number); // getting the update information from the DB
        },
        (error) => {
          console.error('error', error);
        }
      );
    }
    
/**
 * @author aldo armenta
 * @description
 * esta funcion realiza:
 * - Con la ayuda del metodo 'timeCalculator' el calculo del tiempo que el andon estuvo activado el cual se 
 *   guarda en la variable local 'tiempo'
 * - Con la ayuda del metodo 'convertTimeToSeconds' la actualizacion en segundos de la variable 'time' 
 * - El incremento de valor de la variable 'localStorageAndonTime' en base al valor de la variable 'time'
 * - la actualizacion/asignacion de valores unicos del 'localStorage' de "andonTime ['actualLineNumber']" 
 *   apartir del valor de la variable 'localStorageAndonTime'
 * - peticion HTTP GET a la API de laravel para actualizar con la ayuda del metodo 'convertSecondsToTime' 
 *   el 'tiempo de paro acumulado' (commulative_stoppage_time) de la linea de produccion apartir del valor de la variable
 *  'localStorageAndonTime'
 * 
 * 
 * por ultimo se llama al metodo 'getCST'  para actualizar en pantalla la informacion que se actualizo 
 * en la BD sin tener que recargar la pagina.
 * 
 * @param line_number Numero de linea que se quiere actualizar 
 */
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
  

  
  /**
   * @author aldo armenta
   * @description
   * esta funcion activa la alarma de andon.
   */
  andonAlarm() { // method that activates an alarm each time the andon is running
    if (this.isplaying) {
      this.audio.loop = true;
      this.audio.play();
    } else {
      this.audio.loop = false;
      this.audio.pause();
    }
  }
  /**
   * @author aldo armenta
   * 
   * @description
   * Esta función se utiliza para restaurar los datos almacenados previamente en el almacenamiento local (localStorage)
   *  y asignarlos a las variables correspondientes. Los datos que se restauran incluyen las siguientes variables:
   *  - localStorageAndonTime
   *  - andonBtnColorChg
   *  - changeBg
   */
  resoredData(){
    const storedValue = localStorage.getItem('andonTime ' + this.actualLineNumber);
    
      // Si existe un valor previo, asignarlo a la variable localStorageAndonTime
      this.localStorageAndonTime = parseInt(storedValue ?? '0');
    

    const andonBtnColorChgRestored: string | null = localStorage.getItem('  andonBtnColorChg ' + this.actualLineNumber);
    const changeBgRestored: string | null = localStorage.getItem('changeBg ' + this.actualLineNumber);
  
  

    if (  andonBtnColorChgRestored === 'true' ||   andonBtnColorChgRestored == null ) {
      this.andonBtnColorChg = true;
    } else {
      this.andonBtnColorChg = false;
    }
    if (changeBgRestored === 'false' || changeBgRestored == null ) {
      this.changeBg = false;
    } else {
      this.changeBg = true;
    }
    

  }
  /**********************helpers methods******************/
  
  /**
   * @author aldo armenta
   * @description
   * Esta funcion se utiliza para generar una razon aleatoria del arreglo 'reasons' 
   * @returns Regresa una razon aleatoria
   *  @deprecated se eliminara esta funcion en cuanto se tenga acceso a la base de datos de SCADA
   */
  getRandomReason() { // trash method it's just to get a random item from the array reasons 
    const random = Math.round(Math.random() * (this.reasons.length - 1));
    return this.reasons[random];
  }
  /**
   * @author aldo armenta
   * @description
   * Esta función se utiliza para convertir una cadena de tiempo en formato HH:mm:ss a su equivalente en segundos.
   * Toma la cadena de tiempo como argumento y devuelve el total de segundos calculado.
   * @param time - cadena de tiempo en formato HH:mm:ss que se desea convertir a segundos.
   * @returns El valor total de segundos equivalente a la cadena de tiempo proporcionada.
   * 
   */
  convertTimeToSeconds(time: string): number {
    const timeParts = time.split(':');
    const hours = parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1]);
    const seconds = parseInt(timeParts[2]);
  
    const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
    return totalSeconds;
  }
  /**
   * @author aldo armenta
   * @description
   * Esta función se utiliza para convertir un número de segundos en su equivalente en formato HH:mm:ss. 
   * Toma el número total de segundos como argumento y devuelve una cadena de tiempo formateada en HH:mm:ss.
   * @param totalSeconds El número total de segundos que se desea convertir a formato de tiempo. 
   * @returns La cadena de tiempo en formato HH:mm:ss que corresponde al número total de segundos proporcionado.
   *
   */
  convertSecondsToTime(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
/******  methods probably i gonna use ********/ 

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
