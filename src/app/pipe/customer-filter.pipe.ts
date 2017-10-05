import {Pipe, PipeTransform} from '@angular/core';
import {Customer} from "../model/customer";
import {StringUtils} from "../utils/string.utils";

@Pipe({
  name: 'customerFilter',
  pure: false
})
export class CustomerFilterPipe implements PipeTransform {
  transform(customers: Customer[], filter: string): any {
    if (!customers || StringUtils.isBlank(filter)) {
      return customers;
    }

    return customers.filter(c => {
      return StringUtils.containsIgnoreCase(c.address, filter)
        || StringUtils.containsIgnoreCase(c.identifier, filter)
        || StringUtils.containsIgnoreCase(c.name, filter)
        || StringUtils.containsIgnoreCase(c.telephoneNumber, filter);
    });
  }
}
