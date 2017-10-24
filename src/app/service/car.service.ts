import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {Car} from "../model/car";
import {Repair} from "../model/repair";
import {AppConfig} from "../configuration/app.config";
import {Customer} from "../model/customer";
import {AuthService} from "./auth.service";

@Injectable()
export class CarService {

  private CARS_API_PREFIX = AppConfig.API_PREFIX + '/cars';

  constructor(private http: Http, private authService: AuthService) {
  }

  getCars(): Observable<Car[]> {
    return this.http
      .get(this.CARS_API_PREFIX, this.authService.getRequestOptions())
      .map(res => res.json()._embedded.cars.map(c => {
        c['customer'] = c._links.customer.href;
        return c;
      }))
      .catch(err => Observable.throw(err));
  }

  getRepairsForCar(carId: number): Observable<Repair[]> {
    return this.http
      .get(this.CARS_API_PREFIX + '/' + carId + '/repairs', this.authService.getRequestOptions())
      .map(res => res.json()._embedded.repairs)
      .catch(err => Observable.throw(err));
  }

  getCustomerForCar(carId: number): Observable<Customer> {
    return this.http
      .get(this.CARS_API_PREFIX + '/' + carId + '/customer', this.authService.getRequestOptions())
      .map(res => {
        console.log(res.json());
        return res.json();
      })
      .catch(err => Observable.throw(err));
  }

  save(car: Car): Observable<any> {
    let body = JSON.stringify(car);
    return this.http
      .post(this.CARS_API_PREFIX, body, this.authService.getRequestOptions())
      .map(res => res.json())
      .catch(err => Observable.throw(err));
  }

  edit(car: Car): Observable<any> {
    let body = JSON.stringify(car);
    return this.http
      .patch(this.CARS_API_PREFIX + '/' + car.id, body, this.authService.getRequestOptions())
      .map(res => res.json())
      .catch(err => Observable.throw(err));
  }

  remove(carId: number): Observable<any> {
    return this.http
      .delete(this.CARS_API_PREFIX + '/' + carId, this.authService.getRequestOptions())
      .map(res => res.json())
      .catch(err => Observable.throw(err));
  }

}
