import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Item} from '../../model/prestamo/Item';

@Injectable({
  providedIn: 'root'
})

export class ItemService {

  private baseUrl = `${environment.baseURL}/v1/items`;

  constructor(private http: HttpClient) {
  }

  getItems(): Observable<any> {
    console.log(this.baseUrl);
    return this.http.get(`${this.baseUrl}`);
  }

  getItemById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  saveItem(item: Item): Observable<any> {
    return this.http.post(`${this.baseUrl}`, item);
  }

  updateItem(item: Item): Observable<any> {
    return this.http.put(`${this.baseUrl}`, item);
  }

  deleteItem(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

}
