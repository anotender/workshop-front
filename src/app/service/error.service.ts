import {Injectable} from "@angular/core";
import {NgProgressService} from "ngx-progressbar";
import {AuthService} from "./auth.service";

@Injectable()
export class ErrorService {

  constructor(private progressService: NgProgressService, private authService: AuthService) {
  }

  handleError(err: any): void {
    if (this.isAuthenticationError(err)) {
      this.authService.logout();
    }
    console.error(JSON.parse(err._body));
    this.progressService.done();
  }

  private isAuthenticationError(err: any): boolean {
    return err.status && err.status === 401;
  }
}
