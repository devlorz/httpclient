import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import * as fromApp from '../store/app.reducers';
import * as fromAuth from '../auth/store/auth.reducers';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private store: Store<fromApp.AppState>) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('Intercepted!', req);
    // const copyReq = req.clone({headers: req.headers.set('', '')});
    return this.store
      .select('auth')
      .take(1)
      .switchMap((authState: fromAuth.State) => {
        const copyReq = req.clone({
          params: req.params.set('auth', authState.token)
        });
        return next.handle(copyReq);
      });
  }
}
