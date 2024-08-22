import {Component, OnInit, ViewChild} from '@angular/core';
import {AsistenciaService} from '../../service/asistencia.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {Asistencia} from '../../model/Asistencia';
import {Curso} from '../../model/Curso';
import {CursoService} from '../../service/curso.service';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-asistencias',
  templateUrl: './asistencias.component.html',
  styleUrls: ['./asistencias.component.scss'],
})
export class AsistenciasComponent implements OnInit {

  botonAgregar = 'Agregar Asistencia';
  botonMostrar = 'Mostrar';
  titulo = 'Asistencias';
  tituloFormulario = 'Asistencia';
  asistencia: Asistencia = new Asistencia();
  displayedColumns: string[] = [
    'id',
    'nombre',
    'apellido',
    'uid',
    'curso',
    'fecha',
    // 'action',
  ];
  displayTable = true;
  dataSource!: MatTableDataSource<any>;
  curso: Curso;
  fecha: Date;
  cursos: Curso[];

  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort!: MatSort;


  constructor(private dialog: MatDialog,
              private asistenciaService: AsistenciaService,
              private cursoService: CursoService) {
  }

  ngOnInit() {
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

  mostrar() {
    this.dataSource = null;
    this.asistenciaService.getAsistenciasByFechaAndCurso(this.curso, this.fecha).subscribe({
      next: (value) => {
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

  openEditForm(data: any) {
    this.asistencia = data;
    this.displayTable = false;
  }

  onFormSubmit() {

  }

  closeCRUD() {
    this.displayTable = true;
  }

}
