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
  templateUrl: './pasar-clase.component.html',
  styleUrls: ['./pasar-clase.component.scss'],
})
export class PasarClaseComponent implements OnInit {

  titulo = 'Pasar Clase';
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
  dataSource = new MatTableDataSource<Alumno>([]);
  alumnos: Alumno[] = [];
  isLoading = false;
  nombreBoton = 'Actualizar alumnos seleccionados';
  cursos: Curso[];
  desdeCursoSelected: Curso;
  aCursoSelected: Curso;
  selectedAlumnos: Alumno[] = [];

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

  getCursos() {
    this.cursoService.getCursos().subscribe({
      next: (value) => {
        this.cursos = value.message;
      },
      error: console.log,
    });
  }

  getAlumnos() {
    if (this.desdeCursoSelected) {
      this.alumnoService.getAlumnoByCursoId(this.desdeCursoSelected.id).subscribe({
        next: (value) => {
          this.alumnos = value.message;
          this.dataSource = new MatTableDataSource(value.message);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        },
        error: console.log,
      });
    } else {
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
  }

  filtro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  isSelected(row: Alumno): boolean {
    return this.selectedAlumnos.includes(row);
  }

  toggleSelection(row: Alumno): void {
    const index = this.selectedAlumnos.indexOf(row);
    if (index === -1) {
      // Si el alumno no está en la lista, lo agregamos
      this.selectedAlumnos.push(row);
    } else {
      // Si ya está seleccionado, lo eliminamos
      this.selectedAlumnos.splice(index, 1);
    }
  }

  compararCursos(curso1: Curso, curso2: Curso): boolean {
    return curso1 && curso2 ? curso1.id === curso2.id : curso1 === curso2;
  }

  guardar() {
    this.selectedAlumnos.forEach(alumno => alumno.curso = this.aCursoSelected);
    console.log(this.selectedAlumnos);
    this.alumnoService.saveAlumnos(this.selectedAlumnos).subscribe({
      next: (response: any) => {
        if (response.error) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: response.error,
          });
        } else {
          Swal.fire({
            title: 'Actualizado!',
            text: 'Los alumnos seleccionados fueron actualizados',
            icon: 'success'
          });
          this.getAlumnos();
          this.selectedAlumnos = [];
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

  toggleSelectAll(event: any): void {
    if (event.checked) {
      // Marca todos los alumnos visibles en la tabla
      this.selectedAlumnos = this.dataSource.data.slice(); // Clonamos los datos visibles
    } else {
      // Desmarca todos los alumnos
      this.selectedAlumnos = [];
    }
  }

  isAllSelected(): boolean {
    return this.selectedAlumnos.length === this.dataSource.data.length && this.dataSource.data.length > 0;
  }

  // Verifica si hay alumnos seleccionados pero no todos (estado indeterminado)
  isIndeterminate(): boolean {
    return this.selectedAlumnos.length > 0 && this.selectedAlumnos.length < this.dataSource.data.length;
  }

}
