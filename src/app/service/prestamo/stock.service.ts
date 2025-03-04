import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Stock} from '../../model/prestamo/Stock';

@Injectable({
  providedIn: 'root'
})

export class StockService {

  private baseUrl = `${environment.baseURL}/v1/stocks`;

  constructor(private http: HttpClient) {
  }

  getStock(): Observable<any> {
    console.log(this.baseUrl);
    return this.http.get(`${this.baseUrl}`);
  }

  getStockById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  saveStock(stock: Stock): Observable<any> {
    return this.http.post(`${this.baseUrl}`, stock);
  }

  updateStock(stock: Stock): Observable<any> {
    return this.http.put(`${this.baseUrl}`, stock);
  }

  deleteStock(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

}
