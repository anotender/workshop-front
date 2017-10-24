import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";
import {AppConfig} from "../configuration/app.config";
import {NgProgressService} from "ngx-progressbar";
import {StringUtils} from "../utils/string.utils";

@Injectable()
export class AuthService {

  constructor(private http: Http, private progressService: NgProgressService) {
  }

  isAuthenticated(): boolean {
    return !this.isTokenExpired() && StringUtils.isNotBlank(localStorage.getItem('token'));
  }

  logout(): void {
    localStorage.clear();
  }

  login(username: string, password: string): void {
    this.progressService.start();
    let token: string = btoa(username + ':' + password);
    this.http
      .get(AppConfig.API_PREFIX + '/authenticate', this.getRequestOptions(token))
      .subscribe(res => {
        localStorage.setItem('token', token);
        localStorage.setItem('expirationTime', (new Date().getTime() + 24 * 60 * 60 * 1000).toString());
        this.progressService.done();
      }, err => {
        console.log(err);
        this.progressService.done();
      });
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
