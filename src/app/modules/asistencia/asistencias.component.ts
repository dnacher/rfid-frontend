import {Component, OnInit, ViewChild} from '@angular/core';
import {AsistenciaService} from '../../service/asistencia/asistencia.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {Asistencia} from '../../model/Asistencia';
import {Curso} from '../../model/Curso';
import {CursoService} from '../../service/biblioteca/curso.service';
import {MatSort} from '@angular/material/sort';
import * as XLSX from 'xlsx';
import {Alumno} from '../../model/Alumno';
import Swal from 'sweetalert2';

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
  opciones: string[] = ['Asistieron', 'No Asistieron'];
  opcionSelected = 'Asistieron';
  asistencia: Asistencia = new Asistencia();
  displayedColumns: string[] = [
    'id',
    'nombre',
    'apellido',
    'uid',
    'curso',
    'fecha',
  ];
  displayTable = true;
  dataSourceAsistencia: MatTableDataSource<Asistencia> = new MatTableDataSource<Asistencia>([]);
  dataSourceAlumno: MatTableDataSource<Alumno> = new MatTableDataSource<Alumno>([]);
  curso: Curso;
  fecha: Date;
  cursos: Curso[];
  exportarExcel = true;

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
      error:  (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error,
        });
      }
    });
  }

  mostrar() {
    this.dataSourceAlumno = new MatTableDataSource<Alumno>();
    this.dataSourceAsistencia = new MatTableDataSource<Asistencia>();
    if (this.opcionSelected === 'Asistieron') {
      this.dataSourceAsistencia = null;
      this.asistenciaService.getAsistenciasByFechaAndCurso(this.curso.id, this.fecha).subscribe({
        next: (value) => {
          this.dataSourceAsistencia = new MatTableDataSource(value.message);
          this.dataSourceAsistencia.sort = this.sort;
          this.dataSourceAsistencia.paginator = this.paginator;
        },
        error:  (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error,
          });
        }
      });
    } else {
      this.asistenciaService.getNoAsistenByCursoAndFecha(this.curso.id, this.fecha).subscribe({
        next: (value) => {
          this.dataSourceAlumno = new MatTableDataSource(value.message);
          this.dataSourceAlumno.sort = this.sort;
          this.dataSourceAlumno.paginator = this.paginator;
        },
        error:  (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error,
          });
        }
      });
    }
  }

  filtro(event: Event) {
    if (this.opcionSelected === 'Asistieron') {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSourceAsistencia.filter = filterValue.trim().toLowerCase();

      if (this.dataSourceAsistencia.paginator) {
        this.dataSourceAsistencia.paginator.firstPage();
      }
    } else {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSourceAlumno.filter = filterValue.trim().toLowerCase();

      if (this.dataSourceAlumno.paginator) {
        this.dataSourceAlumno.paginator.firstPage();
      }
    }
  }

  openEditForm(data: any) {
    this.asistencia = data;
    this.displayTable = false;
  }

  closeCRUD() {
    this.displayTable = true;
  }

  exportToExcel() {
    if (this.opcionSelected === 'Asistieron' && (!this.dataSourceAsistencia ||
      !this.dataSourceAsistencia.data ||
      this.dataSourceAsistencia.data.length === 0)) {
      console.warn('No hay datos para exportar');
      return;
    }

    if (this.opcionSelected === 'No Asistieron' && (!this.dataSourceAlumno.data ||
      this.dataSourceAlumno.data.length === 0)) {
      console.warn('No hay datos para exportar');
      return;
    }

    let dataToExport;

    if (this.opcionSelected === 'Asistieron') {
      // Mapea los datos desde `dataSource` a un formato adecuado para Excel
      dataToExport = this.dataSourceAsistencia.data.map((asistencia: any) => ({
        Nombre: asistencia.alumno.nombre,
        Apellido: asistencia.alumno.apellido,
        Curso: this.curso.nombre,
        Fecha: this.formatDate(this.fecha),
      }));
    }

    if (this.opcionSelected === 'No Asistieron') {
      // Mapea los datos desde `dataSource` a un formato adecuado para Excel
      dataToExport = this.dataSourceAlumno.data.map((alumno: any) => ({
        Nombre: alumno.nombre,
        Apellido: alumno.apellido,
        Curso: alumno.curso.nombre,
        Fecha: this.formatDate(this.fecha),
      }));
    }

    // Crea una hoja de trabajo y un libro de trabajo
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    let titulo;
    if (this.opcionSelected === 'Asistieron') {
      titulo = 'Asistieron ' + this.dateTitulo(this.fecha);
    } else {
      titulo = 'No asistieron ' + this.dateTitulo(this.fecha);
    }

    const workbook: XLSX.WorkBook = {
      Sheets: {[titulo]: worksheet},
      SheetNames: [titulo]
    };

    // Escribe el archivo Excel
    XLSX.writeFile(workbook, 'alumnos_' + this.dateTitulo(this.fecha) + '.xlsx');
  }

  private dateTitulo(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  private formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  isDisableButton() {
    if (this.opcionSelected === 'Asistieron') {
      this.exportarExcel = this.dataSourceAsistencia.data &&
        this.dataSourceAsistencia.data.length>0;
    }
    if (this.opcionSelected === 'No Asistieron') {
      this.exportarExcel = this.dataSourceAlumno.data &&
        this.dataSourceAlumno.data.length>0;
    }
  }

  get canExportToExcel(): boolean {
    if (this.opcionSelected === 'Asistieron' && this.dataSourceAsistencia?.data?.length > 0) {
      return true; // Habilitar el botón si Asistieron está seleccionado y hay datos en dataSourceAsistencia
    }
    if (this.opcionSelected === 'No Asistieron' && this.dataSourceAlumno?.data?.length > 0) {
      return true; // Habilitar el botón si No Asistieron está seleccionado y hay datos en dataSourceAlumno
    }
    return false; // Deshabilitar el botón en cualquier otro caso
  }

  onOpcionChange() {
    if (this.opcionSelected === 'No Asistieron') {
      const todosCurso = new Curso(-1, 'TODOS');
      // Solo añadir si no está ya en la lista
      if (!this.cursos.some(curso => curso.id === -1)) {
        this.cursos.unshift(todosCurso);
      }
    } else {
      this.cursos = this.cursos.filter(curso => curso.id !== -1);
    }
  }

}
