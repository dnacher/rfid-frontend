import {AbstractDomainEntity} from './AbstractDomainEntity';

export class TipoUsuario extends AbstractDomainEntity {
  id: number;
  nombre: string;
  descripcion: string;
}
