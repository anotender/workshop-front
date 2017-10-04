import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Car} from "../../model/car";
import {CarService} from "../../service/car.service";
import {Customer} from "../../model/customer";
import {CustomerService} from "../../service/customer.service";

@Component({
  selector: 'app-cars-table',
  templateUrl: './cars-table.component.html',
  styleUrls: ['./cars-table.component.css']
})
export class CarsTableComponent {
  @Output() carSelected: EventEmitter<Car> = new EventEmitter<Car>();

  newCar: Car = new Car();
  cars: Car[] = [];
  selectedCar: Car = null;
  _customer: Customer = null;

  constructor(private customerService: CustomerService, private carService: CarService) {
  }

  @Input()
  set customer(customer: Customer) {
    this._customer = customer;
    this.customerService
      .getCarsForCustomer(customer.id)
      .subscribe(cars => this.cars = cars);
  }

  selectCar(car: Car): void {
    if (car === this.selectedCar) return;

    this.selectedCar = car;
    this.carSelected.emit(car);
  }

  saveCar(): void {
    this.carService
      .save(this.newCar, this._customer.id)
      .subscribe(res => {
        this.newCar.id = res.id;
        this.cars.push(this.newCar);
        this.newCar = new Car();
      });
  }

}
