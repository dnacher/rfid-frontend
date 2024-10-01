import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import {LibroService} from '../../service/biblioteca/libro.service';
import {NgxSpinnerService} from 'ngx-spinner';
import Swal from 'sweetalert2';
import {Alumno} from '../../model/Alumno';
import {AlumnoService} from '../../service/asistencia/alumno.service';
import {Curso} from '../../model/Curso';
import {CursoService} from '../../service/biblioteca/curso.service';
import {EMPTY, switchMap} from 'rxjs';

@Component({
  selector: 'app-libro',
  templateUrl: './asignar-r-f-i-d.component.html',
  styleUrls: ['./asignar-r-f-i-d.component.scss'],
})
export class AsignarRFIDComponent implements OnInit {

  titulo = 'Alumno';
  displayedColumns: string[] = [
    'id',
    'nombre',
    'apellido',
    'fechaNacimiento',
    'uidCard',
    'curso',
    'acciones'
  ];
  displayTable = true;
  dataSource!: MatTableDataSource<Alumno>;
  alumnos: Alumno[] = [];
  alumnoSelected: Alumno;
  isLoading = false;
  nombreBoton = 'Guardar';
  cursos: Curso[];
  opciones: string[] = ['Asignar', 'Reasignar'];
  opcionSelected = 'Asignar';

  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort!: MatSort;


  constructor(private dialog: MatDialog,
              private alumnoService: AlumnoService,
              private cursoService: CursoService,
              private libroService: LibroService,
              private spinnerService: NgxSpinnerService) {
  }

  ngOnInit() {
    this.getAlumnos();
    this.getCursos();
  }

  agregarAlumno() {
    this.nombreBoton = 'Guardar';
    this.alumnoSelected = new Alumno();
    this.displayTable = false;
  }

  volver() {
    this.displayTable = true;
    this.getAlumnos();
  }

  getCursos() {
    this.cursoService.getCursos().subscribe({
      next: (value) => {
        this.cursos = value.message;
      },
      error: console.log,
    });
  }

  getAlumnos() {
    this.alumnoService.getAlumnos().subscribe({
      next: (value) => {
        this.alumnos = value.message;
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

  borrar(alumno: Alumno) {
    Swal.fire({
      title: 'Realmente deseas borrar el alumno?',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: `No`
    }).then((result) => {
      if (result.isConfirmed) {
        this.procesoBorrar(alumno);
      }
    });
  }

  procesoBorrar(alumno: Alumno) {
    this.alumnoService.deleteAlumno(alumno.id).subscribe({
      next: (response: any) => {
        Swal.fire({
          title: 'Eliminado!',
          text: 'El Alumno ha sido eliminado correctamente.',
          icon: 'success'
        });
        this.getAlumnos(); // Actualizar la lista de libros después de eliminar.
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error,
        });
        this.getAlumnos();
      }
    });
  }

  asignarRFID(alumno: Alumno) {
    this.isLoading = true;
    this.spinnerService.show();

    this.libroService.getRFID().pipe(
      switchMap((response: any) => {
        if (response.error) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: response.error,
          });
          this.isLoading = false;
          this.spinnerService.hide();
          return EMPTY;
        }
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
          this.isLoading = false;
          this.spinnerService.hide();
          // Finaliza el observable actual
          return EMPTY;
        }
        alumno.uidCard = rfid;
        // Si no es el rfid especial, continúa con el flujo normal
        return this.alumnoService.updateAlumno(alumno);
      })
    ).subscribe(
      {
        next: () => {
          this.getAlumnos();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error,
          });
          this.isLoading = false;
          this.spinnerService.hide();
        },
        complete: () => {
          // Finaliza el spinner solo si no se ha redirigido
          this.isLoading = false;
          this.spinnerService.hide();
          this.getAlumnos();
        }
      }
    );
  }

  trackByFn(index: number, item: any) {
    return item.id;
  }

  get esAsignar(): boolean {
    return this.opcionSelected === 'Asignar';
  }

}
