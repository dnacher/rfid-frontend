import {TipoUsuario} from './TipoUsuario';
import {AbstractDomainEntity} from './AbstractDomainEntity';
import {PaginaItem} from './PaginaItem';

export class PermisoUsuario extends AbstractDomainEntity {
  id: number;
  tipoUsuario: TipoUsuario;
  paginaItem: PaginaItem;
  permiso: number;
}
