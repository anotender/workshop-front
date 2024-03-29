import {Component, Input, OnInit} from '@angular/core';
import {Car} from "../../model/car";
import {Repair} from "../../model/repair";
import {RepairService} from "../../service/repair.service";
import {CarService} from "../../service/car.service";
import {NgProgress} from "ngx-progressbar";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ErrorService} from "../../service/error.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-repairs-table',
  templateUrl: './repairs-table.component.html',
  styleUrls: ['./repairs-table.component.css']
})
export class RepairsTableComponent implements OnInit {
  repairs: Repair[] = null;
  _car: Car = null;

  //repair form
  repairId: FormControl;
  description: FormControl;
  workCost: FormControl;
  partsCost: FormControl;
  totalCost: FormControl;
  date: FormControl;
  carMileage: FormControl;
  comments: FormControl;
  repairForm: FormGroup;

  constructor(private carService: CarService,
              private repairService: RepairService,
              private errorService: ErrorService,
              private progress: NgProgress,
              private toastrService: ToastrService,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.repairForm = this.initRepairForm();
  }

  @Input()
  set car(car: Car) {
    this.progress.start();
    this._car = car;
    this.carService
      .getRepairsForCar(car.id)
      .subscribe(repairs => {
        this.repairs = repairs;
        this.progress.done();
      }, err => {
        this.errorService.handleError(err);
      });
  }

  showRepairForm(modal, repair?: Repair): void {
    if (repair) {
      this.repairId.setValue(repair.id);
      this.description.setValue(repair.description);
      this.workCost.setValue(repair.workCost);
      this.partsCost.setValue(repair.partsCost);
      this.totalCost.setValue(repair.partsCost + repair.workCost);
      this.date.setValue(repair.date);
      this.carMileage.setValue(repair.carMileage);
      this.comments.setValue(repair.comments);
    }

    modal.open();
  }

  submitRepairForm(modal, value): void {
    let repair: Repair = this.mapFormValueToRepair(value);

    if (value.repairId) {
      this.editRepair(repair);
    } else {
      this.saveRepair(repair);
    }

    modal.close();
  }

  saveRepair(repair: Repair): void {
    this.progress.start();
    this.repairService
      .save(repair, this._car.id)
      .subscribe(res => {
        repair.id = res.id;
        this.repairs.push(repair);
        this.progress.done();
        this.toastrService.success('Zapisano naprawę');
      }, err => {
        this.errorService.handleError(err);
      });
  }

  editRepair(repair: Repair): void {
    this.progress.start();
    this.repairService
      .edit(repair.id, repair, this._car.id)
      .subscribe(res => {
        let index: number = this.repairs.findIndex(r => r.id === repair.id);
        this.repairs[index] = repair;
        this.progress.done();
        this.toastrService.success('Zapisano naprawę');
      }, err => {
        this.errorService.handleError(err);
      });
  }

  deleteRepair(repair: Repair): void {
    this.progress.start();
    this.repairService
      .remove(repair.id)
      .subscribe(res => {
        let index: number = this.repairs.findIndex(r => r === repair);
        if (index > -1) {
          this.repairs.splice(index, 1);
        }

        this.progress.done();
        this.toastrService.success('Usunięto naprawę');
      }, err => {
        this.errorService.handleError(err);
      });
  }

  costChange(): void {
    this.totalCost.setValue(this.workCost.value + this.partsCost.value);
  }

  private mapFormValueToRepair(value: any): Repair {
    let repair: Repair = new Repair();

    repair.id = value.repairId;
    repair.description = value.description;
    repair.workCost = value.workCost;
    repair.partsCost = value.partsCost;
    repair.date = value.date;
    repair.carMileage = value.carMileage;
    repair.comments = value.comments;

    return repair;
  }

  private initRepairForm(): FormGroup {
    this.repairId = new FormControl('');
    this.description = new FormControl('', [Validators.required]);
    this.workCost = new FormControl(0);
    this.partsCost = new FormControl(0);
    this.totalCost = new FormControl(0);
    this.totalCost.disable(true);
    this.date = new FormControl('', [Validators.required]);
    this.carMileage = new FormControl('');
    this.comments = new FormControl('');

    return this.fb.group({
      repairId: this.repairId,
      description: this.description,
      workCost: this.workCost,
      partsCost: this.partsCost,
      totalCost: this.totalCost,
      date: this.date,
      carMileage: this.carMileage,
      comments: this.comments
    });
  }

}
