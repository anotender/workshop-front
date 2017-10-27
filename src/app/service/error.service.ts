import {Injectable} from "@angular/core";
import {NgProgressService} from "ngx-progressbar";
import {AuthService} from "./auth.service";
import {ToastrService} from "ngx-toastr";

@Injectable()
export class ErrorService {

  constructor(private progressService: NgProgressService,
              private authService: AuthService,
              private toastrService: ToastrService) {
  }

  handleError(err: any): void {
    if (this.isAuthenticationError(err)) {
      this.toastrService.error('Brak dostępu');
      this.authService.logout();
    } else {
      this.toastrService.error('Błąd');
    }
    console.log(err._body || err);
    this.progressService.done();
  }

  private isAuthenticationError(err: any): boolean {
    return err.status && err.status === 401;
  }
}
