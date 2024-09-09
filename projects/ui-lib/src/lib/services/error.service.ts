import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private errorSubject = new Subject<HttpErrorResponse>();
  public error$ = this.errorSubject.asObservable();

  public sendError(error: HttpErrorResponse) {
    this.errorSubject.next(error);
  }
}
