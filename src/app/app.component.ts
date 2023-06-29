import { Component} from '@angular/core';
import { Line1040Component } from './line1040/line1040.component';
import { DomSanitizer } from '@angular/platform-browser';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NavigationEnd } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  imagepath: string = 'assets/img/ZKW-Logo.png'; // logo
  pagetitle: string = 'welcome';
 

  constructor(public sanitizer: DomSanitizer, private titleService: Title, private router: Router, private route: ActivatedRoute) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const pageTitle = this.getPageTitleFromRoute(this.router.url); // Obtiene el título de la página según la ruta activa
        this.titleService.setTitle(pageTitle); // Establece el título de la página
      }
    });
}
ngOnInit() {
 
}

getPageTitleFromRoute(url: string): string {
  switch (url) {
    case '/':
      this.pagetitle = 'welcome';
      return 'Andon 2.0';
    case '/dashboard-maintenance':
      this.pagetitle = 'maintenance dashboard';
      return 'maintenance dashboard';
    default:
      // Obtener el line_number de la URL
      const line_number = this.extractLineNumberFromUrl(url);
      if (line_number) {
        this.pagetitle = 'line ' + line_number;
        return 'Line' + line_number;
      }
      this.pagetitle = "this route doesn't exist";
      return '404 no exist';
      
  }
}

extractLineNumberFromUrl(url: string): string | null {
  const regex = /\/production_lines\/(\d+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
}
