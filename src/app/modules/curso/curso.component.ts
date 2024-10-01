import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import Swal from 'sweetalert2';
import {Curso} from '../../model/Curso';
import {CursoService} from '../../service/biblioteca/curso.service';

@Component({
  selector: 'app-libro',
  templateUrl: './curso.component.html',
  styleUrls: ['./curso.component.scss'],
})
export class CursoComponent implements OnInit {

  titulo = 'Cursos';
  displayedColumns: string[] = [
    'id',
    'nombre',
    'descripcion',
    'acciones'
  ];
  displayTable = true;
  dataSource!: MatTableDataSource<Curso>;
  cursos: Curso[] = [];
  cursoSelected: Curso;
  isLoading = false;
  nombreBoton = 'Guardar';

  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort!: MatSort;


  constructor(private dialog: MatDialog,
              private cursoService: CursoService) {
  }

  ngOnInit() {
    this.getCursos();
  }

  agregarCurso() {
    this.nombreBoton = 'Guardar';
    this.cursoSelected = new Curso(null, '');
    this.displayTable = false;
  }

  volver() {
    this.displayTable = true;
    this.getCursos();
  }

  getCursos() {
    this.cursoService.getCursos().subscribe({
      next: (value) => {
        this.cursos = value.message;
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

  borrar(curso: Curso) {
    Swal.fire({
      title: 'Realmente deseas borrar el curso?',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: `No`
    }).then((result) => {
      if (result.isConfirmed) {
        this.procesoBorrar(curso);
      }
    });
  }

  procesoBorrar(curso: Curso) {
    this.cursoService.deleteCurso(curso.id).subscribe({
      next: (response: any) => {
        Swal.fire({
          title: 'Eliminado!',
          text: 'El curso ha sido eliminado correctamente.',
          icon: 'success'
        });
        this.getCursos(); // Actualizar la lista de libros después de eliminar.
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error,
        });
        this.getCursos();
      }
    })
  }

  editar(curso: Curso) {
    this.nombreBoton = 'Actualizar';
    this.cursoSelected = curso;
    this.displayTable = false;
  }

  guardar() {
    if (this.cursoSelected.id) {
      this.cursoService.updateCurso(this.cursoSelected).subscribe({
        next: (response: any) => {
          Swal.fire({
            title: 'Actualizado!',
            text: 'Se actualizo el libro correctamente',
            icon: 'success'
          });
          this.cursoSelected = new Curso(null, '');
          this.getCursos();
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
      this.cursoService.saveCurso(this.cursoSelected).subscribe({
        next: (response: any) => {
          Swal.fire({
            title: 'Guardado!',
            text: 'Se guardo el libro correctamente',
            icon: 'success'
          });
          this.cursoSelected = new Curso(null, '');
          this.getCursos();
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
    }
  }
}
