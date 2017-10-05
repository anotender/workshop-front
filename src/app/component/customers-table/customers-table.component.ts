import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Customer} from "../../model/customer";
import {CustomerService} from "../../service/customer.service";
import {NgProgressService} from "ngx-progressbar";

@Component({
  selector: 'app-customers-table',
  templateUrl: './customers-table.component.html',
  styleUrls: ['./customers-table.component.css']
})
export class CustomersTableComponent implements OnInit {
  @Output() customerSelected: EventEmitter<Customer> = new EventEmitter<Customer>();

  customerFilterText: string = '';
  newCustomer: Customer = new Customer();
  selectedCustomer: Customer = null;
  customers: Customer[] = [];

  constructor(private customerService: CustomerService, private progressService: NgProgressService) {
  }

  ngOnInit() {
    this.progressService.start();
    this.customerService
      .getCustomers()
      .subscribe(customers => {
        this.customers = customers;
        this.progressService.done();
      });
  }

  selectCustomer(customer: Customer): void {
    if (customer === this.selectedCustomer) return;

    this.selectedCustomer = customer;
    this.customerSelected.emit(customer);
  }

  saveCustomer(): void {
    this.progressService.start();
    this.customerService
      .save(this.newCustomer)
      .subscribe(res => {
        this.newCustomer.id = res.id;
        this.customers.push(this.newCustomer);
        this.newCustomer = new Customer();
        this.progressService.done();
      });
  }

  deleteCustomer(customer: Customer): void {
    this.progressService.start();
    this.customerService
      .remove(customer.id)
      .subscribe(res => {
        if (customer === this.selectedCustomer) this.customerSelected.emit(null);
        this.customers = this.customers.filter(c => c !== customer);
        this.progressService.done();
      });
  }

}
