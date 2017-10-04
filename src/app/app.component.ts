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
    if (customer === this.selectedCustomer) return;

    this.selectedCustomer = customer;
    this.cars = null;
    this.repairs = null;
    this.customerService
      .getCarsForCustomer(customer.id)
      .subscribe(cars => this.cars = cars);
  }

  selectCar(car: Car): void {
    if (car === this.selectedCar) return;

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
        this.newCustomer.id = res.id;
        this.customers.push(this.newCustomer);
        this.newCustomer = new Customer();
      });
  }

  saveCar(): void {
    this.carService
      .save(this.newCar, this.selectedCustomer.id)
      .subscribe(res => {
        this.newCar.id = res.id;
        this.cars.push(this.newCar);
        this.newCar = new Car();
      });
  }

  saveRepair(): void {
    this.repairService
      .save(this.newRepair, this.selectedCar.id)
      .subscribe(res => {
        this.newRepair.id = res.id;
        this.repairs.push(this.newRepair);
        this.newRepair = new Repair();
      });
  }

  deleteRepair(repair: Repair): void {
    this.repairService
      .remove(repair.id)
      .subscribe(res => this.repairs = this.repairs.filter(r => r !== repair));
  }

}
