import {TipoUsuario} from './TipoUsuario';
import {AbstractDomainEntity} from './AbstractDomainEntity';

export class Usuario extends AbstractDomainEntity {
  id: number;
  nombre: string;
  password: string;
  tipoUsuario: TipoUsuario;
  activo: boolean;
}
