import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Customer} from "../../model/customer";
import {CustomerService} from "../../service/customer.service";

@Component({
  selector: 'app-customers-table',
  templateUrl: './customers-table.component.html',
  styleUrls: ['./customers-table.component.css']
})
export class CustomersTableComponent implements OnInit {
  @Output() customerSelected: EventEmitter<Customer> = new EventEmitter<Customer>();

  newCustomer: Customer = new Customer();
  selectedCustomer: Customer = null;
  customers: Customer[] = [];

  constructor(private customerService: CustomerService) {
  }

  ngOnInit() {
    this.customerService
      .getCustomers()
      .subscribe(customers => this.customers = customers);
  }

  selectCustomer(customer: Customer): void {
    if (customer === this.selectedCustomer) return;

    this.selectedCustomer = customer;
    this.customerSelected.emit(customer);
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


}
