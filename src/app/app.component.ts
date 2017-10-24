import {Component} from '@angular/core';
import {Customer} from "./model/customer";
import {Car} from "./model/car";
import {AuthService} from "./service/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  selectedCustomer: Customer = null;
  selectedCar: Car = null;
  customerMode: boolean = false;
  carMode: boolean = true;

  constructor(private authService: AuthService) {
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  login(password: string): void {
    this.clearSelections();
    this.authService.login('username', password);
  }

  handleCustomerSelected(customer: Customer): void {
    this.selectedCustomer = customer;
    this.selectedCar = null;
  }

  handleCarSelected(car: Car): void {
    this.selectedCar = car;
  }

  selectCustomerMode(): void {
    this.customerMode = true;
    this.carMode = false;
    this.clearSelections();
  }

  selectCarMode(): void {
    this.customerMode = false;
    this.carMode = true;
    this.clearSelections();
  }

  clearSelections(): void {
    this.selectedCar = null;
    this.selectedCustomer = null;
  }

  getCustomerTableClass(): any {
    return {
      'col-md-12': this.selectedCustomer === null,
      'col-md-6': this.selectedCustomer !== null && this.selectedCar === null,
      'col-md-3': this.selectedCustomer !== null && this.selectedCar !== null
    };
  }

  getCarTableClass(): any {
    return {
      'col-md-12': this.carMode && this.selectedCar === null,
      'col-md-6': (this.carMode && this.selectedCar !== null) || (this.customerMode && this.selectedCar === null),
      'col-md-3': this.customerMode && this.selectedCar !== null
    }
  }

}
