import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class NgrokInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clona la solicitud y agrega el encabezado personalizado
    const clonedRequest = req.clone({
      setHeaders: {
        'ngrok-skip-browser-warning': 'true'
      }
    });

    // Pasa la solicitud clonada al siguiente interceptor
    return next.handle(clonedRequest);
  }
}
