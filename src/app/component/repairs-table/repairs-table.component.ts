import {Component, Input} from '@angular/core';
import {Car} from "../../model/car";
import {Repair} from "../../model/repair";
import {RepairService} from "../../service/repair.service";
import {CarService} from "../../service/car.service";

@Component({
  selector: 'app-repairs-table',
  templateUrl: './repairs-table.component.html',
  styleUrls: ['./repairs-table.component.css']
})
export class RepairsTableComponent {
  newRepair: Repair = new Repair();
  repairs: Repair[] = null;
  _car: Car = null;

  constructor(private carService: CarService, private repairService: RepairService) {
  }

  @Input()
  set car(car: Car) {
    this._car = car;
    this.carService
      .getRepairsForCar(car.id)
      .subscribe(repairs => this.repairs = repairs);
  }

  saveRepair(): void {
    this.repairService
      .save(this.newRepair, this._car.id)
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
