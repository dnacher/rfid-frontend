import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import Swal from 'sweetalert2';
import {Alumno} from '../../model/Alumno';
import {AlumnoService} from '../../service/asistencia/alumno.service';
import {Curso} from '../../model/Curso';
import {CursoService} from '../../service/biblioteca/curso.service';

@Component({
  selector: 'app-libro',
  templateUrl: './alumno.component.html',
  styleUrls: ['./alumno.component.scss'],
})
export class AlumnoComponent implements OnInit {

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

  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort!: MatSort;


  constructor(private dialog: MatDialog,
              private alumnoService: AlumnoService,
              private cursoService: CursoService) {
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

  editar(alumno: Alumno) {
    this.nombreBoton = 'Actualizar';
    this.alumnoSelected = alumno;
    this.displayTable = false;
    this.alumnoSelected.curso = this.cursos.find(curso => curso.id === alumno.curso.id);
  }

  compararCursos(curso1: Curso, curso2: Curso): boolean {
    return curso1 && curso2 ? curso1.id === curso2.id : curso1 === curso2;
  }

  guardar() {
    if (this.alumnoSelected.id) {
      this.alumnoService.updateAlumno(this.alumnoSelected).subscribe({
        next: (response: any) => {
          Swal.fire({
            title: 'Actualizado!',
            text: 'Se actualizo el alumno correctamente',
            icon: 'success'
          });
          this.alumnoSelected = new Alumno();
          this.getAlumnos();
          this.displayTable = true;
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
      console.log(this.alumnoSelected);
      this.alumnoService.saveAlumno(this.alumnoSelected).subscribe({
        next: (response: any) => {
          if (response.error) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: response.error,
            });
          } else {
            Swal.fire({
              title: 'Guardado!',
              text: 'Se guardo el alumno correctamente',
              icon: 'success'
            });
            this.alumnoSelected = new Alumno();
            this.getAlumnos();
            this.displayTable = true;
          }
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
  }
}
