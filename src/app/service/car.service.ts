import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {Car} from "../model/car";
import {Repair} from "../model/repair";
import {AppConfig} from "../configuration/app.config";
import {Customer} from "../model/customer";

@Injectable()
export class CarService {

  private CARS_API_PREFIX = AppConfig.API_PREFIX + '/cars';
  private HEADERS = new Headers({'Content-Type': 'application/json'});
  private OPTIONS = new RequestOptions({headers: this.HEADERS});

  constructor(private http: Http) {
  }

  getCars(): Observable<Car[]> {
    return this.http
      .get(this.CARS_API_PREFIX)
      .map(res => res.json()._embedded.cars.map(c => {
        c['customer'] = c._links.customer.href;
        return c;
      }))
      .catch(err => Observable.throw(err));
  }

  getRepairsForCar(carId: number): Observable<Repair[]> {
    return this.http
      .get(this.CARS_API_PREFIX + '/' + carId + '/repairs')
      .map(res => res.json()._embedded.repairs)
      .catch(err => Observable.throw(err));
  }

  getCustomerForCar(carId: number): Observable<Customer> {
    return this.http
      .get(this.CARS_API_PREFIX + '/' + carId + '/customer')
      .map(res => {
        console.log(res.json());
        return res.json();
      })
      .catch(err => Observable.throw(err));
  }

  save(car: Car): Observable<any> {
    let body = JSON.stringify(car);
    return this.http
      .post(this.CARS_API_PREFIX, body, this.OPTIONS)
      .map(res => res.json())
      .catch(err => Observable.throw(err));
  }

  edit(car: Car): Observable<any> {
    let body = JSON.stringify(car);
    return this.http
      .patch(this.CARS_API_PREFIX + '/' + car.id, body, this.OPTIONS)
      .map(res => res.json())
      .catch(err => Observable.throw(err));
  }

  remove(carId: number): Observable<any> {
    return this.http
      .delete(this.CARS_API_PREFIX + '/' + carId)
      .map(res => res.json())
      .catch(err => Observable.throw(err));
  }

}
