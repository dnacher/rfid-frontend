import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import {NgxSpinnerService} from 'ngx-spinner';
import Swal from 'sweetalert2';
import {Usuario} from '../../model/Usuario';
import {UsuarioService} from '../../service/seguridad/usuario.service';
import {TipoUsuario} from '../../model/TipoUsuario';
import {TipoUsuarioService} from '../../service/seguridad/tipoUsuario.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss'],
})
export class UsuarioComponent implements OnInit {

  titulo = 'Usuarios';
  displayedColumns: string[] = [
    'id',
    'nombre',
    'tipoUsuario',
    'acciones'
  ];
  displayTable = true;
  dataSource!: MatTableDataSource<Usuario>;
  usuarios: Usuario[] = [];
  tipoUsuarios: TipoUsuario[] = [];
  usuarioSelected: Usuario;
  isLoading = false;
  nombreBoton = 'Guardar';
  confirmPassword = '';
  imagenSeleccionada: File | null = null;
  imagenVistaPrevia: string | null = null;
  maxSizeInBytes = 10 * 1024 * 1024; // 10 MB

  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort!: MatSort;


  constructor(private dialog: MatDialog,
              private usuarioService: UsuarioService,
              private tipoUsuarioService: TipoUsuarioService,
              private spinnerService: NgxSpinnerService) {
  }

  ngOnInit() {
    this.getUsuarios();
    this.getTipoUsuarios();
  }

  agregarLibro() {
    this.nombreBoton = 'Guardar';
    this.usuarioSelected = new Usuario();
    this.displayTable = false;
  }

  volver() {
    this.displayTable = true;
    this.getUsuarios();
    this.confirmPassword = '';
  }

  getTipoUsuarios() {
    this.tipoUsuarioService.getTipoUsuarios().subscribe({
      next: (value) => {
        this.tipoUsuarios = value.message;
      },
      error: console.log,
    });
  }

  getUsuarios() {
    this.usuarioService.getUsuarios().subscribe({
      next: (value) => {
        this.usuarios = value.message;
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

  borrar(usuario: Usuario) {
    Swal.fire({
      title: 'Realmente deseas borrar el usuario?',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: `No`
    }).then((result) => {
      if (result.isConfirmed) {
        this.procesoBorrar(usuario);
      }
    });
  }

  procesoBorrar(usuario: Usuario) {
    this.usuarioService.deleteUsuarioById(usuario.id).subscribe({
      next: (response: any) => {
        Swal.fire({
          title: 'Eliminado!',
          text: 'El usuario ha sido eliminado correctamente.',
          icon: 'success'
        });
        this.getUsuarios(); // Actualizar la lista de libros después de eliminar.
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error,
        });
        this.getUsuarios();
      }
    });
  }

  editar(usuario: Usuario) {
    this.nombreBoton = 'Actualizar';
    this.usuarioSelected = usuario;
    this.displayTable = false;
    this.usuarioSelected.tipoUsuario = this.tipoUsuarios.find(tipoUsuario => tipoUsuario.id === usuario.tipoUsuario.id);
  }

  compararTipoUsuario(tipoUsuario1: TipoUsuario, tipoUsuario2: TipoUsuario): boolean {
    return tipoUsuario1 && tipoUsuario2 ? tipoUsuario1.id === tipoUsuario2.id : tipoUsuario1 === tipoUsuario2;
  }

  guardar() {
    if (this.usuarioSelected.id) {
      this.usuarioService.updateUsuario(this.usuarioSelected).subscribe({
        next: (response: any) => {
          Swal.fire({
            title: 'Guardado!',
            text: 'Se actualizo el usuario correctamente',
            icon: 'success'
          });
          this.usuarioSelected = new Usuario();
          this.confirmPassword = '';
          this.getUsuarios();
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
      console.log(this.usuarioSelected);
      if (this.imagenSeleccionada) {
        if (this.imagenSeleccionada.size > this.maxSizeInBytes) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'El archivo es demasiado grande. El tamaño máximo permitido es 10 MB.',
          });
        } else {
          this.usuarioService.saveUsuarioWithImagen(this.usuarioSelected, this.imagenSeleccionada).subscribe({
            next: (response: any) => {
              Swal.fire({
                title: 'Guardado!',
                text: 'Se guardo el usuario correctamente',
                icon: 'success'
              });
              this.usuarioSelected = new Usuario();
              this.confirmPassword = '';
              this.getUsuarios();
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
  }

  passwordsNoCoinciden(): boolean {
    return this.usuarioSelected.password !== this.confirmPassword;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imagenSeleccionada = file;

      // Crear una vista previa de la imagen
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenVistaPrevia = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }


}
