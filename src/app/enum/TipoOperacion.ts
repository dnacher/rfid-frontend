export class TipoOperacion {
  static readonly CARGA = new TipoOperacion(1, 'Carga');
  static readonly GASTO = new TipoOperacion(2, 'Cancelado');
  static readonly DEVUELTO = new TipoOperacion(3, 'Nota credito');

  private constructor(public readonly id: number, public readonly estado: string) {}

  public static fromId(id: number): TipoOperacion {
    const values = [TipoOperacion.CARGA, TipoOperacion.GASTO, TipoOperacion.DEVUELTO];
    const tipo = values.find(tipo => tipo.id === id);
    if (!tipo) {
      throw new Error(`Código de tipo de operación no válido: ${id}`);
    }
    return tipo;
  }
}
