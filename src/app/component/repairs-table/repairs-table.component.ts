import {Component, Input} from '@angular/core';
import {Car} from "../../model/car";
import {Repair} from "../../model/repair";
import {RepairService} from "../../service/repair.service";
import {CarService} from "../../service/car.service";
import {NgProgressService} from "ngx-progressbar";

@Component({
  selector: 'app-repairs-table',
  templateUrl: './repairs-table.component.html',
  styleUrls: ['./repairs-table.component.css']
})
export class RepairsTableComponent {
  newRepair: Repair = new Repair();
  repairs: Repair[] = null;
  _car: Car = null;

  constructor(private carService: CarService,
              private repairService: RepairService,
              private progressService: NgProgressService) {
  }

  @Input()
  set car(car: Car) {
    this.progressService.start();
    this._car = car;
    this.carService
      .getRepairsForCar(car.id)
      .subscribe(repairs => {
        this.repairs = repairs;
        this.progressService.done();
      });
  }

  saveRepair(): void {
    this.progressService.start();
    this.repairService
      .save(this.newRepair, this._car.id)
      .subscribe(res => {
        this.newRepair.id = res.id;
        this.repairs.push(this.newRepair);
        this.newRepair = new Repair();
        this.progressService.done();
      });
  }

  deleteRepair(repair: Repair): void {
    this.progressService.start();
    this.repairService
      .remove(repair.id)
      .subscribe(res => {
        this.repairs = this.repairs.filter(r => r !== repair);
        this.progressService.done();
      });
  }

}
