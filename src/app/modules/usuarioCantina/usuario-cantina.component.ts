import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import {LibroService} from '../../service/libro.service';
import {NgxSpinnerService} from 'ngx-spinner';
import Swal from 'sweetalert2';
import {Inventario} from '../../model/Inventario';
import {switchMap} from 'rxjs';
import {UsuarioCantinaService} from '../../service/usuario-cantina.service';
import {HistorialUsuarioCantina} from '../../model/HistorialUsuarioCantina';
import {HistorialService} from '../../service/historial.service';

@Component({
  selector: 'app-libro',
  templateUrl: './usuario-cantina.component.html',
  styleUrls: ['./usuario-cantina.component.scss'],
})
export class UsuarioCantinaComponent implements OnInit {

  titulo = 'Inventario';
  displayedColumns: string[] = [
    'id',
    'nombre',
    'apellido',
    'saldo',
    'tipoOperacion',
    'fecha',
    'observaciones'
  ];
  saldoForm = false;
  saldo = 0;
  observaciones = '';
  displayTable = true;
  dataSource!: MatTableDataSource<HistorialUsuarioCantina>;
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
              private spinnerService: NgxSpinnerService) {
  }

  ngOnInit() {
  }

  volver() {
    this.displayTable = true;
  }

  agregarInventario() {
    this.nombreBoton = 'Guardar';
    this.displayTable = false;
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

  private formatDate(date: Date): string {
    const d = new Date(date);
    const month = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const year = d.getFullYear();

    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
  }


  cargarTarjeta() {
    this.saldoForm = true;
  }

  getHistorial() {
    this.displayTable = false;
  }

}
