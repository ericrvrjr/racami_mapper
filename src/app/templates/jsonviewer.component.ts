import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MapperService } from "../app.service";

@Component({
  selector: "json-tree-racami",
  styleUrls: ['./jsonviewer.component.css'],
  template: `
      <!-- Accordion Start -->
    <accordion *ngFor="let a of this.data|keyvalue" [collapsing]="collapsing">
      <accordion-item *ngIf="a.key!=='collapsed' && a.key !== 'id'" title="{{a.key}}" [expanded]="true">
      <ng-template accordionContent>
      <div class="p-4">
          <json-tree-racami  *ngIf="!$any(a).value.hasOwnProperty('dbfield'); else fieldPresent" [data]="a.value"/>
                <ng-template #fieldPresent>
                    <!-- <app-combo-box [fieldid] ="$any(a).value.path" [list]="mapperSvc.getDbFields()" /> -->
                    <input type="text" class="app-input" id="$any(a).value.path"[(ngModel)]="$any(a).value.dbfield" (input)="this.handleChange($any(a).value)" />
                </ng-template>
          </div>
      </ng-template>
      </accordion-item>
    </accordion>
    <!-- Accordion End -->
`
})



export class JsonTreeComponent {
  @Input()
  data: any


  constructor(public mapperSvc: MapperService) { }

  collapsing: boolean = true;
  handleChange(a: any) {
    this.mapperSvc.setMap(a.value.path, a.value.dbfield);
  }

}