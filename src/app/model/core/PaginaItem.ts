export class PaginaItem {
  id: number
  paginaOrigen: string;
  tituloMenu: string;
  routerLink: string;
  carpeta: string;
  esCarpeta: boolean;


  constructor(id: number, paginaOrigen: string, tituloMenu: string, routerLink: string, carpeta: string, esCarpeta: boolean) {
    this.id = id;
    this.paginaOrigen = paginaOrigen;
    this.tituloMenu = tituloMenu;
    this.routerLink = routerLink;
    this.carpeta = carpeta;
    this.esCarpeta = esCarpeta;
  }
}
