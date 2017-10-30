import {Injectable} from "@angular/core";
import {NgProgress} from "ngx-progressbar";
import {AuthService} from "./auth.service";
import {ToastrService} from "ngx-toastr";

@Injectable()
export class ErrorService {

  constructor(private progress: NgProgress,
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
    this.progress.done();
  }

  private isAuthenticationError(err: any): boolean {
    return err.status && err.status === 401;
  }
}
