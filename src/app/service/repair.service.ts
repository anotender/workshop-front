import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {Repair} from "../model/repair";

@Injectable()
export class RepairService {

  private API_PREFIX = 'http://localhost:8080';
  private HEADERS = new Headers({'Content-Type': 'application/json'});
  private OPTIONS = new RequestOptions({headers: this.HEADERS});

  constructor(private http: Http) {
  }

  save(repair: Repair, carId: number): Observable<any> {
    repair.car = this.API_PREFIX + '/cars/' + carId;
    let body = JSON.stringify(repair);
    return this.http
      .post(this.API_PREFIX + '/repairs', body, this.OPTIONS)
      .catch(err => Observable.throw(err));
  }

}
