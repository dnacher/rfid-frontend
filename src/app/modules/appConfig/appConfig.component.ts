import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import Swal from 'sweetalert2';
import {AppConfig} from '../../model/AppConfig';
import {PermisoUsuarioService} from '../../service/seguridad/permisoUsuario.service';

@Component({
  selector: 'app-libro',
  templateUrl: './appConfig.component.html',
  styleUrls: ['./appConfig.component.scss'],
})
export class AppConfigComponent implements OnInit {

  titulo = 'App config';
  displayedColumns: string[] = [
    'id',
    'clave',
    'valor',
    'acciones'
  ];
  displayTable = true;
  dataSource!: MatTableDataSource<AppConfig>;
  appconfigs: AppConfig[] = [];
  appConfigSelected: AppConfig;
  isLoading = false;
  nombreBoton = 'Guardar';

  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort!: MatSort;

  constructor(private dialog: MatDialog,
              private permisoUsuarioService: PermisoUsuarioService) {
  }

  ngOnInit() {
    this.getCursos();
  }

  agregarConfiguracion() {
    this.nombreBoton = 'Guardar';
    this.appConfigSelected = new AppConfig();
    this.displayTable = false;
  }

  volver() {
    this.displayTable = true;
    this.getCursos();
  }

  getCursos() {
    this.permisoUsuarioService.getAppConfig().subscribe({
      next: (value) => {
        this.appconfigs = value.message;
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

  borrar(appConfig: AppConfig) {
    Swal.fire({
      title: 'Realmente deseas borrar el curso?',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: `No`
    }).then((result) => {
      if (result.isConfirmed) {
        this.procesoBorrar(appConfig);
      }
    });
  }

  procesoBorrar(appConfig: AppConfig) {
    this.permisoUsuarioService.deleteAppConfigById(appConfig.id).subscribe({
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

  editar(appConfig: AppConfig) {
    this.nombreBoton = 'Actualizar';
    this.appConfigSelected = appConfig;
    this.displayTable = false;
  }

  guardar() {
    if (this.appConfigSelected.id) {
      this.permisoUsuarioService.updateAppConfig(this.appConfigSelected).subscribe({
        next: (response: any) => {
          Swal.fire({
            title: 'Actualizado!',
            text: 'Se actualizo la configuracion correctamente',
            icon: 'success'
          });
          this.appConfigSelected = new AppConfig();
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
      this.permisoUsuarioService.saveAppConfig(this.appConfigSelected).subscribe({
        next: (response: any) => {
          Swal.fire({
            title: 'Guardado!',
            text: 'Se guardo la configuracion correctamente',
            icon: 'success'
          });
          this.appConfigSelected = new AppConfig();
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
