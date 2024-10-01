import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import {Libro} from '../../model/Libro';
import {concatMap, EMPTY, from, Observable, switchMap, toArray} from 'rxjs';
import {Prestamo} from '../../model/Prestamo';
import {NgxSpinnerService} from 'ngx-spinner';
import Swal from 'sweetalert2'
import {LibroService} from '../../service/biblioteca/libro.service';
import {AlumnoService} from '../../service/asistencia/alumno.service';
import {PrestamoService} from '../../service/biblioteca/prestamo.service';

@Component({
  selector: 'app-biblioteca',
  templateUrl: './biblioteca.component.html',
  styleUrls: ['./biblioteca.component.scss'],
})
export class BibliotecaComponent implements OnInit {

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
  isTable = true;
  displayedColumns: string[] = [
    'id',
    'titulo',
    'autor',
    'editorial',
    'isbn',
    'cantidadDisponible',
    'acciones'
  ];
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
              private spinnerService: NgxSpinnerService) {
  }

  ngOnInit() {
    this.getLibros();
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

  filtro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  displayDevueltos() {
    this.displayTable = false;
  }

  displayLibros() {
    this.displayTable = true;
    this.isLoading = false;
    this.spinnerService.hide();
    this.tituloReporte = '';
  }

  devolverLibro(prestamo: Prestamo) {
    this.prestamoService.devolverPrestamo(prestamo).subscribe({
      next: () => {
        this.prestamosList = null;
        Swal.fire({
          title: 'El libro se devolvio correctamente',
          text: 'Queres devolver mas libros?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si',
          cancelButtonText: 'No'
        }).then((result) => {
          if (!result.isConfirmed) {
            this.displayLibros();
          } else {
            this.prestamoService.getPrestamoByUid(prestamo.alumno.uidCard).subscribe({
              next: value => {
                this.prestamosList = new MatTableDataSource(value.message);
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
        });
      }
    });
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
      case 'Devolver Libros':
        this.devolver();
        break;
      case 'Prestamo Libros':
        this.guardar();
    }
  }

  onComboOpcionChange() {
    switch (this.opcion) {
      case 'Devolver Libros':
        this.isdiasSeleccionados = false;
        this.isFecha = false;
        this.isTable = false;
        this.opcionText = 'Devolver'
        break;
      case 'Prestamo Libros':
        this.getLibros();
        this.isdiasSeleccionados = true;
        this.isFecha = true;
        this.isTable = true;
        this.opcionText = 'Guardar';
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

  private formatDate(date: Date): string {
    const d = new Date(date);
    const month = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const year = d.getFullYear();

    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
  }

  devolver() {
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
        return this.prestamoService.getPrestamoByUid(rfid);
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


  // Acción del botón guardar
  guardar() {
    this.isLoading = true;
    this.spinnerService.show();
    this.librosSeleccionados = this.getSelectedLibros();

    if (this.todosLibrosDisponibles(this.librosSeleccionados)) {
      this.libroService.getRFID().pipe(
        switchMap((response: any) => {
          const rfid = response.message;
          return this.alumnoService.getAlumnosByUid(rfid);
        })
      ).subscribe({
        next: (alumnoResponse: any) => {
          const alumno = alumnoResponse.message;
          this.isLoading = false;
          this.spinnerService.hide();

          // Guardar todos los préstamos uno por uno
          this.guardarPrestamos(alumno, this.librosSeleccionados).subscribe({
            next: () => {
              // Finalización exitosa
              this.fechaInicio = null;
              this.fechaFin = null;
              this.checkboxHabilitado = false;
              this.onCheckboxChange();
              this.getLibros();
              Swal.fire({
                title: 'Guardado!',
                text: 'Todos los préstamos fueron guardados exitosamente',
                icon: 'success'
              });
            },
            error: console.log
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
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Verifica los libros',
        text: 'Hay alguno de los libros que no están disponibles ahora',
      });
    }
  }

// Método para guardar todos los préstamos uno por uno
  guardarPrestamos(alumno: any, libros: Libro[]): Observable<any> {
    return from(libros).pipe(
      concatMap(libro => {
        const prestamo: Prestamo = new Prestamo(
          null,
          this.fechaInicio,
          this.fechaFin,
          false,
          alumno,
          libro
        );
        return this.prestamoService.savePrestamo(prestamo.toBackendFormat());
      }),
      toArray()
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
