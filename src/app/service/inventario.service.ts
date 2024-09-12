import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Inventario} from '../model/Inventario';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class InventarioService {

  private baseUrl = `${environment.baseURL}/v1/inventarios`;

  constructor(private http: HttpClient) {
  }

  getInventarios(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getInventariosByProducto(productoId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/producto/${productoId}`);
  }

  getInventariosById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  saveInventario(inventario: Inventario): Observable<any> {
    return this.http.post(`${this.baseUrl}`, inventario);
  }

  updateInventario(inventario: Inventario): Observable<any> {
    return this.http.put(`${this.baseUrl}`, inventario);
  }

  deleteInventario(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

}
