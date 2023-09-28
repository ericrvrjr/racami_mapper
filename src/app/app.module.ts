import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule, } from '@angular/platform-browser';
import  {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComboBoxComponent } from './combo_box/combo_box.component';
import { FormsModule } from '@angular/forms';
import { MapperService } from './app.service';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { ObjectToArrayPipe } from './utils/object_to_array';
import { AccordionModule } from "./accordion/accordion.module";
import { CommonModule } from '@angular/common';
import { JsonTreeComponent } from './templates/jsonviewer.component';
@NgModule({
    declarations: [
        AppComponent,
        ComboBoxComponent,
        ObjectToArrayPipe,
        JsonTreeComponent
    ],
    providers: [MapperService],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        NgxJsonViewerModule,
        AccordionModule,
        BrowserAnimationsModule,
        CommonModule
    ]
})
export class AppModule { }
