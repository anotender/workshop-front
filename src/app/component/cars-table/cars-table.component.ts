import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Car} from "../../model/car";
import {CarService} from "../../service/car.service";
import {Customer} from "../../model/customer";
import {CustomerService} from "../../service/customer.service";
import {NgProgressService} from "ngx-progressbar";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AppConfig} from "../../configuration/app.config";
import {StringUtils} from "../../utils/string.utils";

@Component({
  selector: 'app-cars-table',
  templateUrl: './cars-table.component.html',
  styleUrls: ['./cars-table.component.css']
})
export class CarsTableComponent implements OnInit {
  @Output() carSelected: EventEmitter<Car> = new EventEmitter<Car>();

  carFilterText: string = '';
  cars: Car[] = [];
  selectedCar: Car = null;
  _customer: Customer = null;

  //car form
  carId: FormControl;
  name: FormControl;
  engine: FormControl;
  vin: FormControl;
  registrationNumber: FormControl;
  carForm: FormGroup;

  constructor(private customerService: CustomerService,
              private carService: CarService,
              private progressService: NgProgressService,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.carForm = this.initCarForm();
  }

  @Input()
  set customer(customer: Customer) {
    this.progressService.start();
    this._customer = customer;
    if (customer) {
      this.customerService
        .getCarsForCustomer(customer.id)
        .subscribe(cars => {
          this.cars = cars;
          this.progressService.done();
        });
    } else {
      this.carService
        .getCars()
        .subscribe(cars => {
          this.cars = cars;
          this.progressService.done();
        })
    }

  }

  selectCar(car: Car): void {
    this.selectedCar = car;
    this.carSelected.emit(car);
  }

  showCarForm(event, modal, car?: Car): void {
    event.stopPropagation();

    if (car) {
      this.carId.setValue(car.id);
      this.name.setValue(car.name);
      this.engine.setValue(car.engine);
      this.vin.setValue(car.vin);
      this.registrationNumber.setValue(car.registrationNumber);
    }

    modal.open();
  }

  submitCarForm(modal, value): void {
    let car: Car = this.mapFormValueToCar(value);

    if (value.carId) {
      this.progressService.start();
      this.carService
        .getCustomerForCar(value.carId)
        .subscribe(customer => {
          car.customer = AppConfig.API_PREFIX + '/customer/' + customer.id;
          this.editCar(car);
        }, err => {
          console.log(err);
          this.progressService.done();
        });
    } else {
      car.customer = AppConfig.API_PREFIX + '/customer/' + this._customer.id;
      this.saveCar(car);
    }

    modal.close();
  }

  saveCar(car: Car): void {
    this.progressService.start();
    this.carService
      .save(car)
      .subscribe(res => {
        car.id = res.id;
        this.cars.push(car);
        this.progressService.done();
      }, err => {
        console.log(err);
        this.progressService.done();
      });
  }

  editCar(car: Car): void {
    this.carService
      .edit(car)
      .subscribe(res => {
        let index: number = this.cars.findIndex(c => c.id === car.id);
        this.cars[index] = car;
        this.progressService.done();
      }, err => {
        console.log(err);
        this.progressService.done();
      });
  }

  deleteCar(car: Car): void {
    this.progressService.start();
    this.carService
      .remove(car.id)
      .subscribe(res => {
        if (car === this.selectedCar) this.carSelected.emit(null);

        let index: number = this.cars.findIndex(c => c === car);
        if (index > -1) {
          this.cars.splice(index, 1);
        }

        this.progressService.done();
      }, err => {
        console.log(err);
        this.progressService.done();
      });
  }

  registrationNumberFocusOut(): void {
    this.registrationNumber.setValue(this.registrationNumber.value.replace(/\s/g, '').toUpperCase());
  }

  getTitle(): string {
    return this._customer ? 'Samochody ' + this._customer.name : 'Wszystkie samochody';
  }

  private mapFormValueToCar(value: any): Car {
    let car: Car = new Car();

    car.id = value.carId;
    car.name = StringUtils.getStringOrNull(value.name);
    car.engine = StringUtils.getStringOrNull(value.engine);
    car.vin = StringUtils.getStringOrNull(value.vin);
    car.registrationNumber = StringUtils.getStringOrNull(value.registrationNumber);

    return car;
  }

  private initCarForm(): FormGroup {
    this.carId = new FormControl();
    this.name = new FormControl(null, [Validators.required]);
    this.engine = new FormControl(null, [Validators.required]);
    this.vin = new FormControl();
    this.registrationNumber = new FormControl();

    return this.fb.group({
      carId: this.carId,
      name: this.name,
      engine: this.engine,
      vin: this.vin,
      registrationNumber: this.registrationNumber
    });

  }

}
