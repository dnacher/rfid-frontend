import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import Swal from 'sweetalert2';
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
              private tipoUsuarioService: TipoUsuarioService) {
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

  borrar(tipoUsuario: TipoUsuario) {
    Swal.fire({
      title: 'Realmente deseas borrar el tipo de usuario?',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: `No`
    }).then((result) => {
      if (result.isConfirmed) {
        this.procesoBorrar(tipoUsuario);
      }
    });
  }

  procesoBorrar(tipoUsuario: TipoUsuario) {
    this.tipoUsuarioService.deleteTipoUsuarioById(tipoUsuario.id).subscribe({
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
        next: () => {
          Swal.fire({
            title: 'Guardado!',
            text: 'Se actualizo el tipo de usuario correctamente',
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
      this.tipoUsuarioService.saveTipoUsuario(this.tipoUsuarioSelected).subscribe({
        next: () => {
          Swal.fire({
            title: 'Guardado!',
            text: 'Se guardo el tipo de usuario correctamente',
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
