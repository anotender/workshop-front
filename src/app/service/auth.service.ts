import {Injectable} from "@angular/core";
import {Headers, RequestOptions} from "@angular/http";
import {StringUtils} from "../utils/string.utils";

@Injectable()
export class AuthService {

  isAuthenticated(): boolean {
    return !this.isTokenExpired() && StringUtils.isNotBlank(localStorage.getItem('token'));
  }

  logout(): void {
    localStorage.clear();
  }

  login(username: string, password: string): void {
    let token: string = btoa(username + ':' + password);
    localStorage.setItem('token', token);
    localStorage.setItem('expirationTime', (new Date().getTime() + 60 * 60 * 1000).toString());
  }

  getRequestOptions(): RequestOptions {
    let headers: Headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + this.getToken()
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
