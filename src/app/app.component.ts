import { Component } from '@angular/core';
import { MapperService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})



export class AppComponent {
  title: string;
  collapsing = true;
  
  constructor(public mapperSvc: MapperService) {
    this.title = "racami_xmljson_mapper";
  }

}
