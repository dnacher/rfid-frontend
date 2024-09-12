export class EstadoTransaccion {
  static readonly PROCESADO = new EstadoTransaccion(1, 'Procesado');
  static readonly CANCELADO = new EstadoTransaccion(2, 'Cancelado');
  static readonly NOTA_CREDITO = new EstadoTransaccion(3, 'Nota credito');

  private constructor(public readonly id: number, public readonly estado: string) {}

  public static fromId(id: number): EstadoTransaccion {
    const values = [EstadoTransaccion.PROCESADO, EstadoTransaccion.CANCELADO, EstadoTransaccion.NOTA_CREDITO];
    const valorId = values.find(tipo => tipo.id === id);
    if (!valorId) {
      throw new Error(`Código de estado transaccion no válido: ${id}`);
    }
    return valorId;
  }
}
