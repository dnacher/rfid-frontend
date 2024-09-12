import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Libro} from '../model/Libro';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class LibroService {

  private baseUrl = `${environment.baseURL}/v1/libros`;

  constructor(private http: HttpClient) {
  }

  getRFID(): Observable<any> {
    return this.http.get(`${this.baseUrl}/rfid`);
  }

  getLibros(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getLibrosByAutor(autor: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/autor/${autor}`);
  }

  getLibrosById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  saveLibro(libro: Libro): Observable<any> {
    return this.http.post(`${this.baseUrl}`, libro);
  }

  updateLibro(libro: Libro): Observable<any> {
    return this.http.put(`${this.baseUrl}`, libro);
  }

  deleteLibro(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

}
