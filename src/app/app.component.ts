import {Component} from '@angular/core';
import {Customer} from "./model/customer";
import {Car} from "./model/car";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  selectedCustomer: Customer = null;
  selectedCar: Car = null;

  constructor() {
  }

  handleCustomerSelected(customer: Customer): void {
    this.selectedCustomer = customer;
  }

  handleCarSelected(car: Car): void {
    this.selectedCar = car;
  }

}
