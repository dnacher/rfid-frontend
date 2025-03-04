import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import Swal from 'sweetalert2';
import {Item} from '../../model/prestamo/Item';
import {ItemService} from '../../service/prestamo/item.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnInit {

  titulo = 'Items';
  displayedColumns: string[] = [
    'id',
    'nombre',
    'descripcion',
    'acciones'
  ];
  displayTable = true;
  dataSource!: MatTableDataSource<Item>;
  items: Item[] = [];
  itemSelected: Item;
  isLoading = false;
  nombreBoton = 'Guardar';

  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort!: MatSort;


  constructor(private dialog: MatDialog,
              private itemService: ItemService) {
  }

  ngOnInit() {
    this.getItems();
  }

  agregarItem() {
    this.nombreBoton = 'Guardar';
    this.itemSelected = new Item(null, '');
    this.displayTable = false;
  }

  volver() {
    this.displayTable = true;
    this.getItems();
  }

  getItems() {
    this.itemService.getItems().subscribe({
      next: (value) => {
        this.items = value.message;
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

  borrar(item: Item) {
    Swal.fire({
      title: 'Realmente deseas borrar el item?',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: `No`
    }).then((result) => {
      if (result.isConfirmed) {
        this.procesoBorrar(item);
      }
    });
  }

  procesoBorrar(item: Item) {
    this.itemService.deleteItem(item.id).subscribe({
      next: (response: any) => {
        Swal.fire({
          title: 'Eliminado!',
          text: 'El item ha sido eliminado correctamente.',
          icon: 'success'
        });
        this.getItems(); // Actualizar la lista de libros después de eliminar.
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error,
        });
        this.getItems();
      }
    })
  }

  editar(item: Item) {
    this.nombreBoton = 'Actualizar';
    this.itemSelected = item;
    this.displayTable = false;
  }

  guardar() {
    if (this.itemSelected.id) {
      this.itemService.updateItem(this.itemSelected).subscribe({
        next: (response: any) => {
          Swal.fire({
            title: 'Actualizado!',
            text: 'Se actualizo el libro correctamente',
            icon: 'success'
          });
          this.itemSelected = new Item(null, '');
          this.getItems();
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
      this.itemService.saveItem(this.itemSelected).subscribe({
        next: (response: any) => {
          Swal.fire({
            title: 'Guardado!',
            text: 'Se guardo el libro correctamente',
            icon: 'success'
          });
          this.itemSelected = new Item(null, '');
          this.getItems();
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
