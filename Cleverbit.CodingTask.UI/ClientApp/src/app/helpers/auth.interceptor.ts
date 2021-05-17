import { AuthService } from 'src/app/shared/services/auth.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Get the auth token from the service.
    const authToken = this.authService.CurrentUserValue?.token;

    if (authToken)
    {
      request = request.clone({
        headers: request.headers.set('Authorization', 'Basic ' + authToken)
      });
    }

    return next.handle(request);
  }
}
