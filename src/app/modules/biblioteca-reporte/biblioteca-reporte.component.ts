import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import {LibroService} from '../../service/biblioteca/libro.service';
import {Libro} from '../../model/Libro';
import {AlumnoService} from '../../service/asistencia/alumno.service';
import {concatMap, EMPTY, from, Observable, switchMap, toArray} from 'rxjs';
import {Prestamo} from '../../model/Prestamo';
import {PrestamoService} from '../../service/biblioteca/prestamo.service';
import {NgxSpinnerService} from 'ngx-spinner';
import Swal from 'sweetalert2'
import {Curso} from '../../model/Curso';
import {CursoService} from '../../service/biblioteca/curso.service';

@Component({
  selector: 'app-biblioteca',
  templateUrl: './biblioteca-reporte.component.html',
  styleUrls: ['./biblioteca-reporte.component.scss'],
})
export class BibliotecaReporteComponent implements OnInit {

  tituloReporte = '';
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;
  diasSeleccionados: number | null = null;
  opcion: string | null = 'Prestamo Libros';
  opcionText = 'Guardar';
  checkboxHabilitado = false;
  guardarHabilitado = false;
  botonAgregar = 'Agregar Asistencia';
  botonMostrar = 'Mostrar';
  titulo = 'Biblioteca';
  tituloFormulario = 'Biblioteca';
  isdiasSeleccionados = true;
  isFecha = true;
  isCurso = false;
  cursos: Curso[];
  curso;
  displayedPrestamo: string[] = [
    'id',
    'fechaPrestamo',
    'fechaDevolucion',
    'fechaDevolucionReal',
    'devuelto',
    'alumno',
    'libro',
    'acciones'
  ];
  displayTable = true;
  dataSource!: MatTableDataSource<Libro>;
  prestamosList!: MatTableDataSource<any>;
  fecha: Date;
  libros: Libro[] = [];
  librosSeleccionados: Libro[];
  isLoading = false;

  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort!: MatSort;


  constructor(private dialog: MatDialog,
              private libroService: LibroService,
              private alumnoService: AlumnoService,
              private prestamoService: PrestamoService,
              private spinnerService: NgxSpinnerService,
              private cursoService: CursoService) {
  }

  ngOnInit() {
    this.getLibros();
    this.getCursos();
  }

  getLibros() {
    this.libroService.getLibros().subscribe({
      next: (value) => {
        this.libros = value.message;
        this.dataSource = new MatTableDataSource(value.message);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.log,
    });
  }

  getCursos() {
    this.cursoService.getCursos().subscribe({
      next: (value) => {
        this.cursos = value.message;
      },
      error: console.log,
    });
  }

  filtro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  displayLibros() {
    this.displayTable = true;
    this.isLoading = false;
    this.spinnerService.hide();
    this.tituloReporte = '';
  }

  onComboChange() {
    if (this.checkboxHabilitado && this.diasSeleccionados) {
      const fechaInicio = new Date(this.fechaInicio);
      this.fechaFin = new Date(fechaInicio.setDate(fechaInicio.getDate() + this.diasSeleccionados));
    }
    this.verificarGuardarHabilitado();
  }

  procesar() {
    switch (this.opcion) {
      case 'Libros no devueltos':
        this.noDevueltos();
        break;
      case 'Historial Alumno':
        this.historialAlumno();
        break;
      case 'Devolucion por fecha':
        this.devolucionPorFecha();
        break;
    }
  }

  onComboOpcionChange() {
    switch (this.opcion) {
      case 'Libros no devueltos':
        this.isdiasSeleccionados = false;
        this.isFecha = false;
        this.isCurso = false;
        this.opcionText = 'Ver reporte';
        break;
      case 'Historial Alumno':
        this.isdiasSeleccionados = false;
        this.isFecha = false;
        this.isCurso = false;
        this.opcionText = 'Ver reporte';
        break;
      case 'Devolucion por fecha':
        this.isdiasSeleccionados = false;
        this.isFecha = true;
        this.isCurso = true;
        this.opcionText = 'Ver reporte';
        break;
    }
  }

  onCheckboxChange() {
    if (this.checkboxHabilitado) {
      this.fechaInicio = new Date();  // Establece la fecha de hoy en el primer datepicker
      this.diasSeleccionados = null;  // Resetea la selección del combo
      this.fechaFin = null;           // Resetea la fecha fin
    } else {
      this.fechaFin = null;           // Resetea la fecha fin si el checkbox está deshabilitado
      this.diasSeleccionados = null;  // Resetea la selección del combo si el checkbox está deshabilitado
    }
    this.verificarGuardarHabilitado();
  }

  // Verifica si el botón de guardar debe estar habilitado
  verificarGuardarHabilitado() {
    if (this.fechaInicio && this.fechaFin) {
      this.guardarHabilitado = this.fechaInicio < this.fechaFin;
    } else {
      this.guardarHabilitado = false;
    }
  }

  devolucionPorFecha() {
    if (this.fechaInicio && this.fechaFin && this.fechaInicio < this.fechaFin && this.curso) {
      this.tituloReporte = 'Devoluciones por curso y fecha';
      const fechaInicioFormatted = this.formatDate(this.fechaInicio);
      const fechaFinFormatted = this.formatDate(this.fechaFin);
      this.prestamoService.findPrestamosByFecha(this.curso, fechaInicioFormatted, fechaFinFormatted).subscribe({
        next: (response: any) => {
          this.prestamosList = new MatTableDataSource(response.message);
          this.displayTable = false;
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error,
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Verificar valores',
        text: 'Debes elegir fecha inicio, fecha fin y curso.',
      });
    }
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    const month = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const year = d.getFullYear();

    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
  }

  noDevueltos() {
    this.tituloReporte = 'Libros No Devueltos al dia de hoy';
    this.prestamoService.getPrestamoNoDevueltos().subscribe({
      next: (response: any) => {
        this.prestamosList = new MatTableDataSource(response.message);
        this.displayTable = false;
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error,
        });
      }
    });
  }

  historialAlumno() {
    this.tituloReporte = 'Historial Alumno';
    this.isLoading = true;
    this.spinnerService.show();
    this.libroService.getRFID().pipe(
      switchMap((response: any) => {
        const rfid = response.message;
        // Verifica si el rfid es "c3-37-2f-02"
        if (rfid === 'c3-37-2f-02') {
          // Muestra el mensaje de Swal
          Swal.fire({
            icon: 'info',
            title: 'Cambio de Módulo',
            text: 'Se cambió al módulo de asistencia.',
          }).then(() => {
            // Redirige al módulo de asistencia después de mostrar el mensaje
            window.location.href = 'http://localhost:4200/asistencia';
          });
          // Finaliza el observable actual
          return EMPTY;
        }
        // Si no es el rfid especial, continúa con el flujo normal
        return this.prestamoService.getHistorialByUid(rfid);
      })
    ).subscribe(
      {
        next: (response: any) => {
          this.prestamosList = new MatTableDataSource(response.message);
          this.displayTable = false;
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error,
          });
        },
        complete: () => {
          // Finaliza el spinner solo si no se ha redirigido
          this.isLoading = false;
          this.spinnerService.hide();
        }
      }
    );
  }

  isWithinDueDate(fechaDevolucion: Date): boolean {
    const today = new Date();
    const dueDate = new Date(fechaDevolucion);
    return dueDate >= today;
  }

  getSelectedLibros(): Libro[] {
    return this.dataSource.filteredData.filter(libro => libro.selected);
  }

  todosLibrosDisponibles(libros: Libro[]): boolean {
    return libros.every(libro => libro.cantidadDisponible > 0);
  }
}
