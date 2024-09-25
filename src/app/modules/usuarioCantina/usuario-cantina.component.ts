import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import {LibroService} from '../../service/biblioteca/libro.service';
import {NgxSpinnerService} from 'ngx-spinner';
import Swal from 'sweetalert2';
import {switchMap} from 'rxjs';
import {UsuarioCantinaService} from '../../service/cantina/usuario-cantina.service';
import {HistorialUsuarioCantina} from '../../model/HistorialUsuarioCantina';
import {HistorialService} from '../../service/cantina/historial.service';
import {TransaccionService} from '../../service/cantina/transaccion.service';
import {Transaccion} from '../../model/Transaccion';

@Component({
  selector: 'app-libro',
  templateUrl: './usuario-cantina.component.html',
  styleUrls: ['./usuario-cantina.component.scss'],
})
export class UsuarioCantinaComponent implements OnInit {

  titulo = 'Usuario Cantina';
  displayedColumns: string[] = [
    'id',
    'nombre',
    'apellido',
    'saldo',
    'tipoOperacion',
    'fecha',
    'observaciones'
  ];

  displayedTransacciones: string[] = [
    'id',
    'nombre',
    'apellido',
    'total',
    'fecha',
    'estadoTransaccion',
    'acciones'
  ];
  saldoForm = false;
  saldo = 0;
  observaciones = '';
  displayTable = 'INICIO';
  dataSource!: MatTableDataSource<HistorialUsuarioCantina>;
  dataSourceTransaccion!: MatTableDataSource<Transaccion>;
  isLoading = false;
  nombreBoton = 'Guardar';
  fechaInicio: Date;
  fechaFin: Date;
  fechaHabilitado = false;
  historialList: HistorialUsuarioCantina[];

  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort!: MatSort;

  constructor(private dialog: MatDialog,
              private libroService: LibroService,
              private usuarioCantinaService: UsuarioCantinaService,
              private historialService: HistorialService,
              private spinnerService: NgxSpinnerService,
              private transaccionService: TransaccionService) {
  }

  ngOnInit() {
  }

  checkValue(value): boolean {
    return value === this.displayTable;
  }

  volver() {
    this.displayTable = 'INICIO';
  }

  agregarInventario() {
    this.nombreBoton = 'Guardar';
    this.displayTable = 'HISTORIAL';
  }

  getHistorial() {
    this.displayTable = 'HISTORIAL';
  }

  getTransacciones() {
    this.displayTable = 'TRANSACCION';
  }

  filtro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  crearUsuarioCantina() {
    this.isLoading = true;
    this.spinnerService.show();

    this.libroService.getRFID().pipe(
      switchMap((response: any) => {
        const rfid = response.message;
        return this.usuarioCantinaService.saveUsuarioByUidWith0Saldo(rfid);
      })
    ).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.spinnerService.hide();
        Swal.fire({
          title: 'Guardado!',
          text: 'Se creo correctamente el usuario',
          icon: 'success'
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error,
        });
        this.isLoading = false;
        this.spinnerService.hide();
      }
    });
  }

  getSaldo() {
    this.isLoading = true;
    this.spinnerService.show();

    this.libroService.getRFID().pipe(
      switchMap((response: any) => {
        const rfid = response.message;
        return this.usuarioCantinaService.getUsuarioByUid(rfid);
      })
    ).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.spinnerService.hide();

        if (!response.error) {
          Swal.fire({
            title: 'Usuario: ' + response.message.alumno.nombre + ' ' + response.message.alumno.apellido,
            text: 'Saldo: ' + response.message.saldo,
            icon: 'success'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.error,
          });
        }
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error,
        });
        this.isLoading = false;
        this.spinnerService.hide();
      }
    });
  }

  procesarSaldo() {
    this.isLoading = true;
    this.spinnerService.show();

    this.libroService.getRFID().pipe(
      switchMap((response: any) => {
        const rfid = response.message;
        if (!isNaN(Number(this.saldo)) && this.saldo > 0) {
          return this.usuarioCantinaService.cargarSaldo(rfid, this.saldo, this.observaciones);
        } else {
          this.isLoading = false;
          this.spinnerService.hide();
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El saldo debe ser numerico y positivo',
          });
        }
      })
    ).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.spinnerService.hide();
        if (!response.error) {
          Swal.fire({
            title: 'Usuario: ' + response.message.alumno.nombre + ' ' + response.message.alumno.apellido,
            text: 'Saldo: ' + response.message.saldo,
            icon: 'success'
          });
          this.esconderSaldoForm();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.error,
          });
        }
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error,
        });
        this.isLoading = false;
        this.spinnerService.hide();
      }
    });
  }

  esconderSaldoForm() {
    this.saldoForm = false;
    this.saldo = 0;
    this.observaciones = '';
  }

  procesarReporte() {
    this.isLoading = true;
    this.spinnerService.show();

    this.libroService.getRFID().pipe(
      switchMap((response) => {
        const rfid = response.message;
        if (!rfid) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'RFID no válido o no encontrado',
          });
          throw new Error('RFID no válido o no encontrado');
        }
        console.log(rfid);
        if (this.fechaHabilitado) {
          const fechaInicioFormatted = this.formatDate(this.fechaInicio);
          const fechaFinFormatted = this.formatDate(this.fechaFin);
          return this.historialService.findByUsuarioCantinaAlumnoUidCardByFechas(rfid, fechaInicioFormatted, fechaFinFormatted);
        } else {
          return this.historialService.findByUsuarioCantinaAlumnoUidCard(rfid);
        }

      })
    ).subscribe({
      next: (response) => {
        console.log(response.message);
        this.isLoading = false;
        this.spinnerService.hide();
        this.historialList = response.message;
        this.dataSource = new MatTableDataSource(response.message);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error?.message || 'Ocurrió un error inesperado',
        });
        this.isLoading = false;
        this.spinnerService.hide();
      }
    });
  }

  procesarReporteTransaccion() {
    this.isLoading = true;
    this.spinnerService.show();

    this.libroService.getRFID().pipe(
      switchMap((response) => {
        const rfid = response.message;
        if (!rfid) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'RFID no válido o no encontrado',
          });
          throw new Error('RFID no válido o no encontrado');
        }
        console.log(rfid);
        if (this.fechaHabilitado) {
          const fechaInicioFormatted = this.formatDate(this.fechaInicio);
          const fechaFinFormatted = this.formatDate(this.fechaFin);
          return this.transaccionService.findByUsuarioCantinaAlumnoUidCardByFechas(rfid, fechaInicioFormatted, fechaFinFormatted);
        } else {
          return this.transaccionService.findByUidCard(rfid);
        }

      })
    ).subscribe({
      next: (response) => {
        console.log(response.message);
        this.isLoading = false;
        this.spinnerService.hide();
        this.historialList = response.message;
        this.dataSourceTransaccion = new MatTableDataSource(response.message);
        this.dataSourceTransaccion.sort = this.sort;
        this.dataSourceTransaccion.paginator = this.paginator;
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error?.message || 'Ocurrió un error inesperado',
        });
        this.isLoading = false;
        this.spinnerService.hide();
      }
    });
  }

  getReporte(rfid) {
    this.transaccionService.findByUidCard(rfid)
      .subscribe({
        next: (response) => {
          this.historialList = response.message;
          this.dataSourceTransaccion = new MatTableDataSource(response.message);
          this.dataSourceTransaccion.sort = this.sort;
          this.dataSourceTransaccion.paginator = this.paginator;
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error?.message || 'Ocurrió un error inesperado',
          });
        }
      });
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    const month = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const year = d.getFullYear();

    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
  }

  cancelar(row: Transaccion) {
    Swal.fire({
      title: 'Realmente queres cancelar la compra?',
      showDenyButton: true,
      confirmButtonText: 'Si, Cancelar',
      denyButtonText: `No`
    }).then((result) => {
      if (result.isConfirmed) {
        this.cancelarProceso(row);
      } else if (result.isDenied) {
        Swal.fire('No cancelado', '', 'info');
      }
    });
  }

  isProcesado(row) {
    return row === 'PROCESADO';
  }

  cancelarProceso(row: Transaccion) {
    this.isLoading = true;
    this.spinnerService.show();
    console.log(row);

    return this.transaccionService.cancelTransaccion(row.uuid).subscribe({
      next: (response) => {
        console.log(response);
        console.log(row.usuarioCantina.alumno.uidCard);
        this.isLoading = false;
        this.spinnerService.hide();
        this.getReporte(row.usuarioCantina.alumno.uidCard);
        Swal.fire({
          title: 'Cancelado',
          text: 'Se cancelo correctamente',
          icon: 'success'
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error?.message || 'Ocurrió un error inesperado',
        });
        this.isLoading = false;
        this.spinnerService.hide();
      }
    });
  }

  cargarTarjeta() {
    this.saldoForm = true;
  }
}
