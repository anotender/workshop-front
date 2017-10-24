import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {Customer} from "../model/customer";
import {Car} from "../model/car";
import {AppConfig} from "../configuration/app.config";
import {AuthService} from "./auth.service";

@Injectable()
export class CustomerService {

  private CUSTOMERS_API_PREFIX = AppConfig.API_PREFIX + '/customers';

  constructor(private http: Http, private authService: AuthService) {
  }

  getCustomer(customerId: number): Observable<Customer> {
    return this.http
      .get(this.CUSTOMERS_API_PREFIX + '/' + customerId, this.authService.getRequestOptions())
      .map(res => {
        console.log(res.json());
        return res.json();
      })
      .catch(err => Observable.throw(err));
  }

  getCustomers(): Observable<Customer[]> {
    return this.http
      .get(this.CUSTOMERS_API_PREFIX, this.authService.getRequestOptions())
      .map(res => res.json()._embedded.customers)
      .catch(err => Observable.throw(err));
  }

  getCarsForCustomer(customerId: number): Observable<Car[]> {
    return this.http
      .get(this.CUSTOMERS_API_PREFIX + '/' + customerId + '/cars', this.authService.getRequestOptions())
      .map(res => res.json()._embedded.cars.map(c => {
        c['customer'] = c._links.customer.href;
        return c;
      }))
      .catch(err => Observable.throw(err));
  }

  save(customer: Customer): Observable<any> {
    let body = JSON.stringify(customer);
    return this.http
      .post(this.CUSTOMERS_API_PREFIX, body, this.authService.getRequestOptions())
      .map(res => res.json())
      .catch(err => Observable.throw(err));
  }

  edit(customerId: number, customer: Customer): Observable<any> {
    let body = JSON.stringify(customer);
    return this.http
      .patch(this.CUSTOMERS_API_PREFIX + '/' + customerId, body, this.authService.getRequestOptions())
      .map(res => res.json())
      .catch(err => Observable.throw(err));
  }

  remove(customerId: number): Observable<any> {
    return this.http
      .delete(this.CUSTOMERS_API_PREFIX + '/' + customerId, this.authService.getRequestOptions())
      .map(res => res.json())
      .catch(err => Observable.throw(err));
  }

}
