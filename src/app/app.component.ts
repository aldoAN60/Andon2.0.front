import { Component} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NavigationEnd } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  /**
   * @type {string} Ruta donde se encuentra el logo de ZKW
   */
  imagepath: string = 'assets/img/ZKW-Logo.png'; // logo


  constructor(public sanitizer: DomSanitizer, private titleService: Title, public router: Router, private route: ActivatedRoute) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.getPageTitleFromRoute(this.router.url); // Obtiene el título de la página según la ruta activa
        this.titleService.setTitle(this.getPageTitleFromRoute(this.router.url));
      }
    });
}
/**
 * @author aldo armenta
 * @description 
  * Este método recibe una URL como parámetro y devuelve el título de la página correspondiente a esa URL. 
 * El título se determina mediante una serie de casos en un bloque switch. 
 * Si la URL coincide con alguno de los casos específicos, se devuelve el título correspondiente. 
 * Si la URL no coincide con ningún caso, se intenta extraer el número de línea (line_number) de la URL y se devuelve un título 
 * basado en ese número. Si no se puede extraer el número de línea o la URL no coincide con ningún caso, 
 * se devuelve un mensaje indicando que la ruta no existe.
 * @param {string} url - La URL de la página actual.
 * @returns {string} El título de página correspondiente a la URL.
 */
getPageTitleFromRoute(url: string): string {
  switch (url) {
    case '/':
      
      return 'Andon 2.0';

    case '/dashboard-maintenance':
      return 'maintenance dashboard';

      case '/process-monitor-1':
      return 'process monitor 1';

    default:
      // Obtener el line_number de la URL
      const line_number = this.extractLineNumberFromUrl(url);
      if (line_number) {

        return 'Line ' + line_number;
      }
      return "this route doesn't exist";
      
  }
}
/**
 * Este método recibe una URL como parámetro y utiliza una expresión regular para buscar un número de línea
 * en el formato "/production_lines/[número de línea]". Si encuentra una coincidencia, 
 * devuelve el número de línea extraído de la URL. Si no se encuentra ninguna coincidencia, devuelve null.
 * @param {string} url - La URL de la página actual.
 * @returns {string | null} El número de línea extraído de la URL, o null si no se encuentra.
 */
extractLineNumberFromUrl(url: string): string | null {
  const regex = /\/production_lines\/(\d+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
}
