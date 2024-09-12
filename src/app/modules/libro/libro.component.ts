import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import {LibroService} from '../../service/libro.service';
import {Libro} from '../../model/Libro';
import {NgxSpinnerService} from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-libro',
  templateUrl: './libro.component.html',
  styleUrls: ['./libro.component.scss'],
})
export class LibroComponent implements OnInit {

  titulo = 'Libros';
  displayedColumns: string[] = [
    'id',
    'titulo',
    'autor',
    'editorial',
    'isbn',
    'cantidadDisponible',
    'acciones'
  ];
  displayTable = true;
  dataSource!: MatTableDataSource<Libro>;
  libros: Libro[] = [];
  libroSelected: Libro;
  isLoading = false;
  nombreBoton = 'Guardar';

  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort!: MatSort;


  constructor(private dialog: MatDialog,
              private libroService: LibroService,
              private spinnerService: NgxSpinnerService) {
  }

  ngOnInit() {
    this.getLibros();
  }

  agregarLibro() {
    this.nombreBoton = 'Guardar';
    this.libroSelected = new Libro();
    this.displayTable = false;
  }

  volver() {
    this.displayTable = true;
    this.getLibros();
  }

  getLibros() {
    this.libroService.getLibros().subscribe({
      next: (value) => {
        this.libros = value.message;
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

  borrar(libro: Libro) {
    this.libroService.deleteLibro(libro.id).subscribe({
      next: (response: any) => {
        Swal.fire({
          title: 'Eliminado!',
          text: 'El libro ha sido eliminado correctamente.',
          icon: 'success'
        });
        this.getLibros(); // Actualizar la lista de libros después de eliminar.
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error,
        });
        this.getLibros();
      }
    });
  }

  editar(libro: Libro) {
    this.nombreBoton = 'Actualizar';
    this.libroSelected = libro;
    this.displayTable = false;
  }

  guardar() {
    if (this.libroSelected.id) {
      this.libroService.updateLibro(this.libroSelected).subscribe({
        next: (response: any) => {
          Swal.fire({
            title: 'Guardado!',
            text: 'Se actualizo el libro correctamente',
            icon: 'success'
          });
          this.libroSelected = new Libro();
          this.getLibros();
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
      console.log(this.libroSelected);
      this.libroService.saveLibro(this.libroSelected).subscribe({
        next: (response: any) => {
          Swal.fire({
            title: 'Guardado!',
            text: 'Se guardo el libro correctamente',
            icon: 'success'
          });
          this.libroSelected = new Libro();
          this.getLibros();
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
