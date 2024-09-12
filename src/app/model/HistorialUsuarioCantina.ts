import {UsuarioCantina} from './UsuarioCantina';
import {TipoOperacion} from '../enum/TipoOperacion';

export class HistorialUsuarioCantina {
  id: number;
  usuarioCantina: UsuarioCantina;
  saldo: number;
  tipoOperacion: TipoOperacion;
  fecha: Date;
  observaciones: string;
}
