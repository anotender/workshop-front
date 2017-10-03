import {Component, OnInit} from '@angular/core';
import {Customer} from "./model/customer";
import {CustomerService} from "./service/customer.service";
import {CarService} from "./service/car.service";
import {Car} from "./model/car";
import {Repair} from "./model/repair";
import {RepairService} from "./service/repair.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  newCustomer: Customer = new Customer();
  newCar: Car = new Car();
  newRepair: Repair = new Repair();
  selectedCustomer: Customer = null;
  selectedCar: Car = null;
  customers: Customer[] = [];
  cars: Car[] = null;
  repairs: Repair[] = null;

  constructor(private customerService: CustomerService,
              private carService: CarService,
              private repairService: RepairService) {
  }

  ngOnInit(): void {
    this.customerService
      .getCustomers()
      .subscribe(customers => this.customers = customers);
  }

  selectCustomer(customer: Customer): void {
    this.selectedCustomer = customer;
    this.cars = null;
    this.repairs = null;
    this.customerService
      .getCarsForCustomer(customer.id)
      .subscribe(cars => this.cars = cars);
  }

  selectCar(car: Car): void {
    this.selectedCar = car;
    this.repairs = null;
    this.carService
      .getRepairsForCar(car.id)
      .subscribe(repairs => this.repairs = repairs);
  }

  saveCustomer(): void {
    this.customerService
      .save(this.newCustomer)
      .subscribe(res => {
        this.customers.push(this.newCustomer);
      });
  }

  saveCar(): void {
    this.carService
      .save(this.newCar, this.selectedCustomer.id)
      .subscribe(res => {
        this.cars.push(this.newCar);
      });
  }

  saveRepair(): void {
    this.repairService
      .save(this.newRepair, this.selectedCar.id)
      .subscribe(res => {
        this.repairs.push(this.newRepair);
      });
  }

}
