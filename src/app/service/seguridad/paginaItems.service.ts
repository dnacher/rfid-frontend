import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PaginaItemsService {
  private baseUrl = `${environment.baseURL}/v1/pagina-items`;

  constructor(private http: HttpClient) {
  }

  getPaginaItems(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }
}
