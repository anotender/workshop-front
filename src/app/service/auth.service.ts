import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";
import {StringUtils} from "../utils/string.utils";
import {AppConfig} from "../configuration/app.config";
import {NgProgress} from "ngx-progressbar";
import {Observable} from "rxjs/Observable";

@Injectable()
export class AuthService {

  constructor(private http: Http) {
  }

  isAuthenticated(): boolean {
    return !this.isTokenExpired() && StringUtils.isNotBlank(localStorage.getItem('token'));
  }

  logout(): void {
    localStorage.clear();
  }

  login(username: string, password: string): Observable<any> {
    let token: string = btoa(username + ':' + password);
    return this.http
      .get(AppConfig.API_PREFIX + '/authenticate', this.getRequestOptions(token))
      .map(res => token);
  }

  getRequestOptions(token?: string): RequestOptions {
    let headers: Headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + (StringUtils.isNotEmpty(token) ? token : this.getToken())
    });
    return new RequestOptions({headers: headers});
  }

  private getToken(): string {
    return this.isTokenExpired() ? '' : localStorage.getItem('token');
  }

  private isTokenExpired(): boolean {
    let expirationTime: number = Number(localStorage.getItem('expirationTime') || 0);
    return new Date().getTime() > expirationTime;
  }

}
