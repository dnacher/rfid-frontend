import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import Swal from 'sweetalert2';
import {Inventario} from '../../model/Inventario';
import {InventarioService} from '../../service/inventario.service';
import {Producto} from '../../model/Producto';

@Component({
  selector: 'app-libro',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss'],
})
export class ProductoComponent implements OnInit {

  titulo = 'Inventario';
  displayedColumns: string[] = [
    'id',
    'nombre',
    'precio',
    'acciones'
  ];
  displayTable = true;
  dataSource!: MatTableDataSource<Inventario>;
  inventarios: Inventario[] = [];
  inventarioSelected: Inventario;
  isLoading = false;
  nombreBoton = 'Guardar';

  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort!: MatSort;


  constructor(private dialog: MatDialog,
              private inventarioService: InventarioService) {
  }

  ngOnInit() {
    this.getInventarios();
  }

  agregarInventario() {
    this.nombreBoton = 'Guardar';
    const producto = new Producto();
    this.inventarioSelected = new Inventario();
    this.inventarioSelected.producto = producto;
    this.displayTable = false;
  }

  volver() {
    this.displayTable = true;
    this.getInventarios();
  }

  getInventarios() {
    this.inventarioService.getInventarios().subscribe({
      next: (value) => {
        this.inventarios = value.message;
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

  borrar(inventario: Inventario) {
    this.inventarioService.deleteInventario(inventario.id).subscribe({
      next: (response: any) => {
        Swal.fire({
          title: 'Eliminado!',
          text: 'El inventario ha sido eliminado correctamente.',
          icon: 'success'
        });
        this.getInventarios(); // Actualizar la lista de libros después de eliminar.
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error,
        });
        this.getInventarios();
      }
    });
  }

  editar(inventario: Inventario) {
    this.nombreBoton = 'Actualizar';
    this.inventarioSelected = inventario;
    this.displayTable = false;
  }

  guardar() {
    if (this.inventarioSelected.id) {
      this.inventarioService.updateInventario(this.inventarioSelected).subscribe({
        next: (response: any) => {
          Swal.fire({
            title: 'Guardado!',
            text: 'Se actualizo el inventario correctamente',
            icon: 'success'
          });
          this.inventarioSelected = new Inventario();
          this.getInventarios();
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
      console.log(this.inventarioSelected);
      this.inventarioService.saveInventario(this.inventarioSelected).subscribe({
        next: (response: any) => {
          Swal.fire({
            title: 'Guardado!',
            text: 'Se guardo el inventario correctamente',
            icon: 'success'
          });
          this.inventarioSelected = new Inventario();
          this.getInventarios();
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
