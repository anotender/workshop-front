import {Pipe, PipeTransform} from '@angular/core';
import {StringUtils} from "../utils/string.utils";
import {Car} from "../model/car";

@Pipe({
  name: 'carFilter',
  pure: false
})
export class CarFilterPipe implements PipeTransform {
  transform(cars: Car[], filter: string): any {
    if (!cars || StringUtils.isBlank(filter)) {
      return cars;
    }

    return cars.filter(c => {
      return StringUtils.containsIgnoreCase(c.name, filter)
        || StringUtils.containsIgnoreCase(c.engine, filter)
        || StringUtils.containsIgnoreCase(c.registrationNumber, filter)
        || StringUtils.containsIgnoreCase(c.vin, filter);
    });
  }
}
