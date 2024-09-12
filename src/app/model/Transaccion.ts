import {UsuarioCantina} from './UsuarioCantina';
import {LineaTransaccion} from './LineaTransaccion';
import {EstadoTransaccion} from '../enum/EstadoTransaccion';

export class Transaccion {
  id: number;
  usuarioCantina: UsuarioCantina;
  lineasTransacciones: LineaTransaccion[];
  total: number;
  fecha: Date;
  estadoTransaccion: EstadoTransaccion;


  constructor(id: number, usuarioCantina: UsuarioCantina, lineasTransacciones: LineaTransaccion[], total: number, fecha: Date
              ,estadoTransaccion: EstadoTransaccion) {
    this.id = id;
    this.usuarioCantina = usuarioCantina;
    this.lineasTransacciones = lineasTransacciones;
    this.total = total;
    this.fecha = fecha;
    this.estadoTransaccion = estadoTransaccion;
  }
}
