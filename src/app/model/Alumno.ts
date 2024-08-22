import {Curso} from './Curso';

export class Alumno {

  id: number;
  nombre: string;
  apellido: string;
  fechaNacimiento: Date;
  uidCard: string;
  curso: Curso;
  activo: boolean;
}
