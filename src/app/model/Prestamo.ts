import {Alumno} from './Alumno';
import {Libro} from './Libro';

export class Prestamo {
  id: number;
  fechaPrestamo: Date;
  fechaDevolucion: Date;
  devuelto: boolean;
  alumno: Alumno;
  libro: Libro;

  constructor(id: number, fechaPrestamo: Date, fechaDevolucion: Date, devuelto: boolean, alumno: Alumno, libro: Libro) {
    this.id = id;
    this.fechaPrestamo = fechaPrestamo;
    this.fechaDevolucion = fechaDevolucion;
    this.devuelto = devuelto;
    this.alumno = alumno;
    this.libro = libro;
  }

  toBackendFormat(): any {
    return {
      id: this.id,
      fechaPrestamo: this.formatDate(this.fechaPrestamo),
      fechaDevolucion: this.formatDate(this.fechaDevolucion),
      devuelto: this.devuelto,
      alumno: this.alumno,
      libro: this.libro
    };
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
