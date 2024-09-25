import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import {LibroService} from '../../service/biblioteca/libro.service';
import {Libro} from '../../model/Libro';
import {NgxSpinnerService} from 'ngx-spinner';
import Swal from 'sweetalert2';
import {Curso} from '../../model/Curso';
import {CursoService} from '../../service/biblioteca/curso.service';
import {TipoUsuario} from '../../model/TipoUsuario';
import {TipoUsuarioService} from '../../service/seguridad/tipoUsuario.service';

@Component({
  selector: 'app-libro',
  templateUrl: './tipo-usuario.component.html',
  styleUrls: ['./tipo-usuario.component.scss'],
})
export class TipoUsuarioComponent implements OnInit {

  titulo = 'Tipo Usuario';
  displayedColumns: string[] = [
    'id',
    'nombre',
    'descripcion',
    'acciones'
  ];
  displayTable = true;
  dataSource!: MatTableDataSource<TipoUsuario>;
  tipoUsuarios: TipoUsuario[] = [];
  tipoUsuarioSelected: TipoUsuario;
  isLoading = false;
  nombreBoton = 'Guardar';

  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort!: MatSort;


  constructor(private dialog: MatDialog,
              private tipoUsuarioService: TipoUsuarioService,
              private spinnerService: NgxSpinnerService) {
  }

  ngOnInit() {
    this.getTipoUsuarios();
  }

  agregarCurso() {
    this.nombreBoton = 'Guardar';
    this.tipoUsuarioSelected = new TipoUsuario();
    this.displayTable = false;
  }

  volver() {
    this.displayTable = true;
    this.getTipoUsuarios();
  }

  getTipoUsuarios() {
    this.tipoUsuarioService.getTipoUsuarios().subscribe({
      next: (value) => {
        this.tipoUsuarios = value.message;
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
    this.tipoUsuarioService.deleteTipoUsuarioById(curso.id).subscribe({
      next: (response: any) => {
        Swal.fire({
          title: 'Eliminado!',
          text: 'El tipo de usuario ha sido eliminado correctamente.',
          icon: 'success'
        });
        this.getTipoUsuarios(); // Actualizar la lista de libros después de eliminar.
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error,
        });
        this.getTipoUsuarios();
      }
    });
  }

  editar(tiposUsuario: TipoUsuario) {
    this.nombreBoton = 'Actualizar';
    this.tipoUsuarioSelected = tiposUsuario;
    this.displayTable = false;
  }

  guardar() {
    if (this.tipoUsuarioSelected.id) {
      this.tipoUsuarioService.updateTipoUsuario(this.tipoUsuarioSelected).subscribe({
        next: (response: any) => {
          Swal.fire({
            title: 'Guardado!',
            text: 'Se actualizo el libro correctamente',
            icon: 'success'
          });
          this.tipoUsuarioSelected = new TipoUsuario();
          this.getTipoUsuarios();
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
      console.log(this.tipoUsuarioSelected);
      this.tipoUsuarioService.saveTipoUsuario(this.tipoUsuarioSelected).subscribe({
        next: (response: any) => {
          Swal.fire({
            title: 'Guardado!',
            text: 'Se guardo el libro correctamente',
            icon: 'success'
          });
          this.tipoUsuarioSelected = new TipoUsuario();
          this.getTipoUsuarios();
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
