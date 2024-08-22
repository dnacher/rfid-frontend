import {AbstractDomainEntity} from './AbstractDomainEntity';
import {Alumno} from './Alumno';

export class Asistencia extends AbstractDomainEntity {
  id: number;
  alumno: Alumno;
  uid: string;
  cursoId: number;
  fecha: Date;
}
