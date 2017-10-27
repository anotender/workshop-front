import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Customer} from "../../model/customer";
import {CustomerService} from "../../service/customer.service";
import {NgProgressService} from "ngx-progressbar";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {StringUtils} from "../../utils/string.utils";
import {ErrorService} from "../../service/error.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-customers-table',
  templateUrl: './customers-table.component.html',
  styleUrls: ['./customers-table.component.css']
})
export class CustomersTableComponent implements OnInit {
  @Output() customerSelected: EventEmitter<Customer> = new EventEmitter<Customer>();

  customerFilterText: string = '';
  selectedCustomer: Customer = null;
  customers: Customer[] = [];

  //customer form
  customerId: FormControl;
  name: FormControl;
  address: FormControl;
  identifier: FormControl;
  telephoneNumber: FormControl;
  customerForm: FormGroup;

  constructor(private customerService: CustomerService,
              private errorService: ErrorService,
              private progressService: NgProgressService,
              private toastrService: ToastrService,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.progressService.start();
    this.customerForm = this.initCustomerForm();
    this.customerService
      .getCustomers()
      .subscribe(customers => {
        this.customers = customers;
        this.progressService.done();
      }, err => {
        this.errorService.handleError(err);
      });
  }

  selectCustomer(customer: Customer): void {
    this.selectedCustomer = customer;
    this.customerSelected.emit(customer);
  }

  showCustomerForm(event, modal, customer?: Customer): void {
    event.stopPropagation();

    if (customer) {
      this.customerId.setValue(customer.id);
      this.name.setValue(customer.name);
      this.address.setValue(customer.address);
      this.identifier.setValue(customer.identifier);
      this.telephoneNumber.setValue(customer.telephoneNumber);
    }

    modal.open();
  }

  submitCustomerForm(modal, value): void {
    let customer: Customer = this.mapFormValueToCustomer(value);

    if (value.customerId) {
      this.editCustomer(customer);
    } else {
      this.saveCustomer(customer);
    }

    modal.close();
  }

  saveCustomer(customer: Customer): void {
    this.progressService.start();
    this.customerService
      .save(customer)
      .subscribe(res => {
        customer.id = res.id;
        this.customers.push(customer);
        this.progressService.done();
        this.toastrService.success('Zapisano klienta');
      }, err => {
        this.errorService.handleError(err);
      });
  }

  editCustomer(customer: Customer): void {
    this.progressService.start();
    this.customerService
      .edit(customer.id, customer)
      .subscribe(res => {
        let index: number = this.customers.findIndex(c => c.id === customer.id);
        this.customers[index] = customer;
        this.progressService.done();
        this.toastrService.success('Zapisano klienta');
      }, err => {
        this.errorService.handleError(err);
      });
  }

  deleteCustomer(customer: Customer): void {
    this.progressService.start();
    this.customerService
      .remove(customer.id)
      .subscribe(res => {
        if (customer === this.selectedCustomer) {
          this.customerSelected.emit(null);
        }

        let index: number = this.customers.findIndex(c => c === customer);
        if (index > -1) {
          this.customers.splice(index, 1);
        }

        this.progressService.done();
        this.toastrService.success('Usunięto klienta');
      }, err => {
        this.errorService.handleError(err);
      });
  }

  private mapFormValueToCustomer(value: any): Customer {
    let customer: Customer = new Customer();

    customer.id = value.customerId;
    customer.name = StringUtils.getStringOrNull(value.name);
    customer.address = StringUtils.getStringOrNull(value.address);
    customer.identifier = StringUtils.getStringOrNull(value.identifier);
    customer.telephoneNumber = StringUtils.getStringOrNull(value.telephoneNumber);

    return customer;
  }

  private initCustomerForm(): FormGroup {
    this.customerId = new FormControl();
    this.name = new FormControl(null, [Validators.required]);
    this.address = new FormControl();
    this.identifier = new FormControl();
    this.telephoneNumber = new FormControl(null, [Validators.pattern('^[0-9]+$')]);

    return this.fb.group({
      customerId: this.customerId,
      name: this.name,
      address: this.address,
      identifier: this.identifier,
      telephoneNumber: this.telephoneNumber
    });
  }

}
