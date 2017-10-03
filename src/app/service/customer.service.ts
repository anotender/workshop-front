import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {Customer} from "../model/customer";
import {Car} from "../model/car";

@Injectable()
export class CustomerService {

  private CUSTOMERS_API_PREFIX = 'http://localhost:8080/customers';
  private HEADERS = new Headers({'Content-Type': 'application/json'});
  private OPTIONS = new RequestOptions({headers: this.HEADERS});

  constructor(private http: Http) {
  }

  getCustomers(): Observable<Customer[]> {
    return this.http
      .get(this.CUSTOMERS_API_PREFIX)
      .map(res => res.json()._embedded.customers)
      .catch(err => Observable.throw(err));
  }

  getCarsForCustomer(customerId: number): Observable<Car[]> {
    return this.http
      .get(this.CUSTOMERS_API_PREFIX + '/' + customerId + '/cars')
      .map(res => res.json()._embedded.cars)
      .catch(err => Observable.throw(err));
  }

  save(customer: Customer): Observable<any> {
    let body = JSON.stringify(customer);
    return this.http
      .post(this.CUSTOMERS_API_PREFIX, body, this.OPTIONS)
      .catch(err => Observable.throw(err));
  }

}
