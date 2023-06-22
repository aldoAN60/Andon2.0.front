import { Component } from '@angular/core';
import { Line1040Component } from './line1040/line1040.component';
import { ClockComponent } from './clock/clock.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Andon2.0.front';
  lineNumber = 'al 1040/1019'
  imagepath: string = 'assets/img/ZKW-Logo.png';
  changeBg: boolean = false;
  andonBtn: string = 'activate'

constructor(public sanitizer: DomSanitizer){
}
onChangeBg(){
  this.changeBg = !this.changeBg;
  this.andonBtn = 'unactive';
}
}
