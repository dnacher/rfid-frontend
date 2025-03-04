import {Item} from './Item';

export class Stock {
  id: number;
  item: Item;
  cantidadTotal: number;
  cantidadDisponible: number;
  activo: boolean;

  constructor(id:number, item:Item, cantidadTotal:number, cantidadDisponible: number, activo: boolean) {
    this.id = id;
    this.item = item;
    this.cantidadTotal = cantidadTotal;
    this.cantidadDisponible = cantidadDisponible;
    this.activo = activo;
  }

}
