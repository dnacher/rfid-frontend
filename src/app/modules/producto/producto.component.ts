import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import Swal from 'sweetalert2';
import {Inventario} from '../../model/Inventario';
import {InventarioService} from '../../service/cantina/inventario.service';
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
        this.dataSource.filterPredicate = this.crearFiltroPersonalizado();
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

  crearFiltroPersonalizado(): (data: Inventario, filter: string) => boolean {
    return (data: Inventario, filter: string): boolean => {
      const filterValue = filter.trim().toLowerCase();

      // Filtramos en los campos de Inventario y Producto
      const matchesCantidad = data.cantidad.toString().includes(filterValue);
      const matchesProductoNombre = data.producto?.nombre?.toLowerCase().includes(filterValue);

      // Si se quiere filtrar por cantidad o nombre del producto
      return matchesCantidad || matchesProductoNombre;
    };
  }

  borrar(inventario: Inventario) {
    Swal.fire({
      title: 'Realmente deseas borrar el producto?',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: `No`
    }).then((result) => {
      if (result.isConfirmed) {
        this.procesoBorrar(inventario);
      }
    });
  }

  procesoBorrar(inventario: Inventario) {
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
            title: 'Actualizado!',
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

  isFormValid(): boolean {
    const producto = this.inventarioSelected?.producto;
    const nombre = producto?.nombre?.trim(); // Elimina espacios en blanco para asegurar que no sea solo espacios
    const precio = producto?.precio;
    const cantidad = this.inventarioSelected?.cantidad;

    // Verificar que nombre no sea vacío, precio y cantidad no sean negativos o null/undefined
    return nombre && precio >= 0 && cantidad >= 0;
  }
}
