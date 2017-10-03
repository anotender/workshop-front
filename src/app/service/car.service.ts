import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {Car} from "../model/car";
import {Repair} from "../model/repair";

@Injectable()
export class CarService {

  private API_PREFIX = 'http://localhost:8080';
  private HEADERS = new Headers({'Content-Type': 'application/json'});
  private OPTIONS = new RequestOptions({headers: this.HEADERS});

  constructor(private http: Http) {
  }

  getRepairsForCar(carId: number): Observable<Repair[]> {
    return this.http
      .get(this.API_PREFIX + '/cars/' + carId + '/repairs')
      .map(res => res.json()._embedded.repairs)
      .catch(err => Observable.throw(err));
  }

  save(car: Car, customerId: number): Observable<any> {
    car.customer = this.API_PREFIX + '/customers/' + customerId;
    let body = JSON.stringify(car);
    return this.http
      .post(this.API_PREFIX + '/cars', body, this.OPTIONS)
      .catch(err => Observable.throw(err));
  }

}
