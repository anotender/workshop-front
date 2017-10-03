import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {CustomerService} from "./service/customer.service";
import {CarService} from "./service/car.service";
import {RepairService} from "./service/repair.service";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule
  ],
  providers: [
    CustomerService,
    CarService,
    RepairService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
