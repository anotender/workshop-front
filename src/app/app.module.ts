import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {CustomerService} from "./service/customer.service";
import {CarService} from "./service/car.service";
import {RepairService} from "./service/repair.service";
import {CustomersTableComponent} from './component/customers-table/customers-table.component';
import {CarsTableComponent} from './component/cars-table/cars-table.component';
import {RepairsTableComponent} from './component/repairs-table/repairs-table.component';
import {NgProgressModule} from "ngx-progressbar";
import {CustomerFilterPipe} from "./pipe/customer-filter.pipe";
import {CarFilterPipe} from "./pipe/car-filter.pipe";
import {BsModalModule} from "ng2-bs3-modal";

@NgModule({
  declarations: [
    AppComponent,
    CustomersTableComponent,
    CarsTableComponent,
    RepairsTableComponent,
    CustomerFilterPipe,
    CarFilterPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    NgProgressModule,
    BsModalModule
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
