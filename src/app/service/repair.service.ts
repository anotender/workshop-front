import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {Repair} from "../model/repair";
import {AppConfig} from "../configuration/app.config";

@Injectable()
export class RepairService {

  private REPAIRS_API_PREFIX = AppConfig.API_PREFIX + '/repairs';
  private HEADERS = new Headers({'Content-Type': 'application/json'});
  private OPTIONS = new RequestOptions({headers: this.HEADERS});

  constructor(private http: Http) {
  }

  save(repair: Repair, carId: number): Observable<any> {
    repair.car = AppConfig.API_PREFIX + '/cars/' + carId;
    let body = JSON.stringify(repair);
    return this.http
      .post(this.REPAIRS_API_PREFIX, body, this.OPTIONS)
      .map(res => res.json())
      .catch(err => Observable.throw(err));
  }

  edit(repairId: number, repair: Repair, carId: number): Observable<any> {
    repair.car = AppConfig.API_PREFIX + '/cars/' + carId;
    let body = JSON.stringify(repair);
    return this.http
      .patch(this.REPAIRS_API_PREFIX + '/' + repairId, body, this.OPTIONS)
      .map(res => res.json())
      .catch(err => Observable.throw(err));
  }

  remove(repairId: number): Observable<any> {
    return this.http
      .delete(this.REPAIRS_API_PREFIX + '/' + repairId)
      .map(res => res.json())
      .catch(err => Observable.throw(err));
  }

}
