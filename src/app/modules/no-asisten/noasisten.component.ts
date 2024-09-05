import {Component, OnInit, ViewChild} from '@angular/core';
import {AsistenciaService} from '../../service/asistencia.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {Asistencia} from '../../model/Asistencia';
import {Curso} from '../../model/Curso';
import {CursoService} from '../../service/curso.service';
import {MatSort} from '@angular/material/sort';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-no-asisten',
  templateUrl: './noasisten.component.html',
  styleUrls: ['./noasisten.component.scss'],
})
export class NoasistenComponent implements OnInit {

  botonAgregar = 'Agregar Asistencia';
  botonMostrar = 'Mostrar';
  titulo = 'No Asistieron';
  tituloFormulario = 'No Asistieron';
  asistencia: Asistencia = new Asistencia();
  displayedColumns: string[] = [
    'id',
    'nombre',
    'apellido',
    'uidcard',
    'curso',
    'fecha'
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
        const todosCurso = new Curso(-1, 'TODOS');
        this.cursos.unshift(todosCurso); // Añadir al inicio de la lista
      },
      error: console.log,
    });
  }

  exportToExcel() {
    if (!this.dataSource || !this.dataSource.data || this.dataSource.data.length === 0) {
      console.warn('No hay datos para exportar');
      return;
    }

    // Mapea los datos desde `dataSource` a un formato adecuado para Excel
    const dataToExport = this.dataSource.data.map((alumno: any) => ({
      Nombre: alumno.nombre,
      Apellido: alumno.apellido,
      Curso: alumno.curso.nombre,
      Fecha: this.fecha,
    }));

    // Crea una hoja de trabajo y un libro de trabajo
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Alumnos': worksheet },
      SheetNames: ['Alumnos']
    };

    // Escribe el archivo Excel
    XLSX.writeFile(workbook, 'alumnos.xlsx');
  }

  mostrar() {
    this.dataSource = null;
    this.asistenciaService.getNoAsistenByCursoAndFecha(this.curso, this.fecha).subscribe({
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
